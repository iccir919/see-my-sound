const clientId = "63031958f5204a9089c458ee30b5f71e"
const redirectUri = "http://127.0.0.1:5500/index.html"
const params = new URLSearchParams(window.location.search)
const code = params.get("code")

if (!code) {
    redirectToAuthCodeFlow(clientId)
} else {
    const accessToken = await getAccessToken(clientId, code)
    const profile = await fetchProfile(accessToken)
    console.log(profile)
    populateUI(profile)
}

async function redirectToAuthCodeFlow(clientId) {
    const verifier = generateCodeVerifier(128)
    const challenge = await generateCodeChallenge(verifier)


    /*
        we're using local storage to store the verifier data, 
        which works like a password for the token exchange process
    */

    localStorage.setItem("verifier", verifier)
    
    const params = new URLSearchParams()
    params.append("client_id", clientId)
    params.append("response_type", "code")
    params.append("redirect_uri", redirectUri)
    params.append("scope", "user-read-private user-read-email")
    params.append("code_challenge_method", "S256")
    params.append("code_challenge", challenge)

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`
}

function generateCodeVerifier(length) {
    let text = ""
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return text
}

async function generateCodeChallenge(verifier) {
    const data = new TextEncoder().encode(verifier)
    const digest = await window.crypto.subtle.digest("SHA-256", data)
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "") 
}

/*
    we load the verifier from local storage 
    and using both the code returned from the callback and the verifier 
    to perform a POST to the Spotify token API. 
    
    the API uses these two values to verify our request and it returns 
    an access token.
*/

async function getAccessToken(clientId, code) {
    const verifier = localStorage.getItem("verifier")
    const params = new URLSearchParams()
    params.append("client_id", clientId)
    params.append("grant_type", "authorization_code")
    params.append("code", code)
    params.append("redirect_uri", redirectUri)
    params.append("code_verifier", verifier)

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params
    })

    const data = await result.json()
    return data.access_token    
}

async function fetchProfile(token) {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    })
    return await result.json()
}

function populateUI(profile) {
    document.getElementById("displayName").innerText = profile.display_name

    if (profile.images[0]) {
        const profileImage = new Image(200, 200)
        profileImage.src = profile.images[0].url
        document.getElementById("avatar").appendChild(profileImage)
        document.getElementById("imgUrl").innerText = profile.images[0].url
    }

    document.getElementById("id").innerText = profile.id
    document.getElementById("email").innerText = profile.email
    document.getElementById("uri").innerText = profile.uri
    document.getElementById("uri").setAttribute("href", profile.external_urls.spotify)
    document.getElementById("url").innerText = profile.href
    document.getElementById("url").setAttribute("href", profile.href)
}