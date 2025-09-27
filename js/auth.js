console.log("auth.js is loaded")

const clientId = "63031958f5204a9089c458ee30b5f71e"
const redirectUri = "https://iccir919.github.io/see-my-sound/callback.html"
// const redirectUri = "http://127.0.0.1:5500/callback.html"
const scope = "user-top-read"

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

const sha256 = async (plain) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(plain)
    return crypto.subtle.digest("SHA-256", data)
}

/*
    base64urlencode

    this function will convert the array buffer to a base64 string
    then convert the base64 string to a base64url string
*/
const base64urlencode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "")
}

const redirectToSpotifyAuth = async () => {
    console.log("redirecting to Spotify auth...")

    const codeVerifier = generateRandomString(128)
    /*
        using local storage to store the verifier data, 
        which works like a password for the token exchange process
    */
    localStorage.setItem("code_verifier", codeVerifier)
    const hashed = await sha256(codeVerifier)
    const codeChallenge = base64urlencode(hashed)

    
    const params = new URLSearchParams({
        response_type: "code",
        client_id: clientId,
        scope: scope,
        redirect_uri: redirectUri,
        code_challenge_method: "S256",
        code_challenge: codeChallenge
    })

    window.location = `https://accounts.spotify.com/authorize?${params.toString()}`
}

const fetchAccessToken = async (code, codeVerifier) => {

    const url = "https://accounts.spotify.com/api/token"
    const payload = {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            client_id: clientId,
            grant_type: "authorization_code",
            code: code,
            redirect_uri: redirectUri,
            code_verifier: codeVerifier
        })
    }

    const body = await fetch(url, payload)
    const response = await  body.json()

    if (response.access_token) {
        localStorage.setItem("access_token", response.access_token)
        localStorage.setItem("refresh_token", response.refresh_token)
        localStorage.removeItem("code_verifier")
        window.location = "index.html"
    } else {
        console.error("Failed to get access token", response)
    }
}


const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refresh_token")
    
    if (!refreshToken) {
        console.error("No refresh token found")
        return null
    }

    const body = new URLSearchParams({
        client_id: clientId,
        grant_type: "refresh_token",
        refresh_token: refreshToken
    })

    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: body
    })

    const data = await response.json()
    console.log("Refresh token response:", data)

    if (data.access_token) {
        localStorage.setItem("access_token", data.access_token)
        if (data.refresh_token) {
            localStorage.setItem("refresh_token", data.refresh_token)
        }
        return data.access_token
    } else {
        console.error("Failed to refresh access token", data)
        return null
    }
}

function logout() {
    console.log("logging out...")
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    window.location.reload()
}



export { redirectToSpotifyAuth, fetchAccessToken, refreshAccessToken, logout }