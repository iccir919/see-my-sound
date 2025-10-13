console.log("auth.js is loaded")

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI
const scope = "user-top-read"


/*
    redirectToSpotifyAuth

    this function will redirect the user to the Spotify authorization
    endpoint with the necessary parameters for PKCE authentication
*/
export async function redirectToSpotifyAuth() {
    const codeVerifier = generateRandomString(128)
    const codeChallengeBuffer = await sha256(codeVerifier)
    const codeChallenge = base64urlencode(codeChallengeBuffer)

    localStorage.setItem("code_verifier", codeVerifier)

    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        response_type: "code",
        redirect_uri: REDIRECT_URI,
        code_challenge_method: "S256",
        code_challenge: codeChallenge,
        scope,
    })

    window.location = `https://accounts.spotify.com/authorize?${params.toString()}`
}


export async function fetchAccessToken(code, codeVerifier) {

    const body = new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: "authorization_code",
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier,
        code
    })


    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body
    })

    return await response.json()
}

export async function refreshAccessToken() {
    const refreshToken = localStorage.getItem("refresh_token")
    if (!refreshToken) {
        console.error("No refresh token found")
        return null
    }

    const url = "https://accounts.spotify.com/api/token"
    const body = new URLSearchParams({
        client_id: clientId,
        grant_type: "refresh_token",
        refresh_token: refreshToken
    })

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body
    })

    return await response.json()
}

/*
    PKCE (Proof Key for Code Exchange) authorization flow
*/

/*
    PKCE authorization flow starts with the creation of a 
    code verifier
*/

/*
    code verifier

    a code verifier is a high-entropy cryptographic random string with a 
    length between 43 and 128 characters (the longer the better)
     
    itt can contain letters, digits, underscores, periods, hyphens, 
    or tildes.

*/
const generateRandomString = (length = 128) => {
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    const values = crypto.getRandomValues(new Uint32Array(length))
    return values.reduce((acc, x) => acc + possible[x % possible.length], "")
}

/*
    code challenge

    a code challenge is a Base64-URL-encoded SHA256 hash of the code verifier

    the code challenge is sent to the authorization server in the initial
    authorization request
*/

async function sha256(plain) {
    const encoder = new TextEncoder()
    const data = encoder.encode(plain)
    return crypto.subtle.digest("SHA-256", data)
}

/*
    base64urlencode

    this function will convert the array buffer to a base64 string
    then convert the base64 string to a base64url string
*/
function base64urlencode (input) {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "")
}