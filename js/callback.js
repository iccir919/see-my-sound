console.log("callback.js loaded")

import { fetchAccessToken } from "./auth.js"

const handleCallback = async () => {
    const params = new URLSearchParams(window.location.search)
    const codeVerifier = localStorage.getItem("code_verifier")
    const code = params.get("code")
    const error = params.get("error")

    if (error) {
        console.error("Error during authentication", error)
        return
    }

    if (!code) {
        console.error("No code found in URL")
        return
    }

    if (!codeVerifier) {
        console.error("No code verifier found in local storage")
        return
    }

    const tokenResponse = await fetchAccessToken(code, codeVerifier)
    console.log("Token response:", tokenResponse)

    if (tokenResponse && tokenResponse.access_token) {
        localStorage.setItem("access_token", tokenResponse.access_token)
        if (tokenResponse.refresh_token) {
            localStorage.setItem("refresh_token", tokenResponse.refresh_token)
        }
        localStorage.removeItem("code_verifier")
    } else {
        console.error("Failed to obtain access token")
    }

    window.location = "index.html"
}

handleCallback()