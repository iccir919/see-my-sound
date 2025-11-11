import { tokenManager } from "./tokenManager.js";

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const redirectUri = import.meta.env.VITE_REDIRECT_URI;


function generateCodeVerifier(length = 128) {
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from(crypto.getRandomValues(new Uint8Array(length)))
        .map(x => possible[x % possible.length])
        .join("");
}

async function generateCodeChallenge(verifier) {
    const data = new TextEncoder().encode(verifier);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

export async function redirectToSpotifyAuth() {
    const codeVerifier = generateCodeVerifier();
    const challenge = await generateCodeChallenge(codeVerifier);
    tokenManager.saveCodeVerifier(codeVerifier);

    console.log("Verifier saved:", codeVerifier);
console.log("Verifier retrieved:", tokenManager.getCodeVerifier());

    const params = new URLSearchParams({
        client_id: clientId,
        response_type: "code",
        redirect_uri: redirectUri,
        scope: "user-top-read playlist-modify-private playlist-modify-public",
        code_challenge_method: "S256",
        code_challenge: challenge,
    });

    window.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export async function fetchAccessToken(code, verifier) {
    const tokenData = tokenManager.getAccessToken();
    console.log("token", tokenData)
    if (tokenData) return;

    const body = new URLSearchParams({
        client_id: clientId,
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        code_verifier: verifier,
    });

    const res = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error("Failed to fetch access token", errorText);
        throw new Error(`Failed to fetch access token`);
    }

    const data = await res.json();


    tokenManager.saveTokens(
        data.access_token, 
        data.refresh_token, 
        data.expires_in
    );
    console.log("token success", data.access_token)
    return data;
}

export async function refreshAccessToken(refreshToken) {
    if (!refreshToken) {
        throw new Error("No refresh token available");
    }


    const body = new URLSearchParams({
        client_id: clientId,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
    });

    console.log("Refreshing access token...");

    const res = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error("Failed to refresh access token", errorText);

        if (res.status === 400 || res.status === 401) {
            tokenManager.clearAll()
            throw new Error("REFRESH_TOKEN_INVALID");
        }

        throw new Error(`Failed to refresh access token`);
    }

    const data = await res.json();

    tokenManager.saveTokens(
        data.access_token, 
        data.refresh_token || refreshToken, 
        data.expires_in 
    );

    console.log("Access token refreshed.");
    return data;
}

export async function getValidAccessToken() {
    const currentToken = tokenManager.getAccessToken();

    if (currentToken && !tokenManager.needsRefresh()) {
        return currentToken;
    }

    const refreshToken = tokenManager.getRefreshToken();

    if (!refreshToken) {
        throw new Error("TOKEN_EXPIRED");
    }

    try {
        const data = await refreshAccessToken(refreshToken);
        return data.access_token;
    } catch (error) {
       if (error.message === "REFRESH_TOKEN_INVALID") {
            throw new Error("SESSION_EXPIRED");
       }
       throw error; 
    }
} 