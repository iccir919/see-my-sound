import React, { useState, useEffect } from "react"
import Landing from "./components/Landing"
import Content from "./components/Content"
import './index.css'
import { fetchAccessToken } from "./utils/auth.js"

const App = () => {
    const [accessToken, setAccessToken] = useState(null)

    useEffect(() => {
        // check if already logged in
        const storedAccessToken = localStorage.getItem("access_token")
        if (storedAccessToken) {
            setAccessToken(storedAccessToken)
            return
        }

        // check if returning from Spotify auth
        const params = new URLSearchParams(window.location.search)
        const code = params.get("code")
        const error = params.get("error")
        console.log("code", code)

        if (error) {
            console.error("Spotify authorization error", error)
        } else if (code) {
            const codeVerifier = localStorage.getItem("code_verifier")
            if (!codeVerifier) {
                console.error("No code verifier found in local storage")
                return
            }

            // exchange code for access token
            fetchAccessToken(code, codeVerifier).then(data => {
                if (data) {
                    console.log("received access token", data)
                    localStorage.setItem("access_token", data.access_token)
                    localStorage.setItem("refresh_token", data.refresh_token)
                    setAccessToken(data.access_token)
                    window.history.replaceState({}, document.title, "/") // remove code from URL
                } else {
                    console.error("Failed to obtain access token")
                }
            })  
        } 
    }, [])

    const logout = () => {
        console.log("logging out...")
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        setAccessToken(null)
    }

    return (
        <div id="app">
            {accessToken ? 
            <Content
                accessToken={accessToken} 
                logout={logout} 
            /> : <Landing />}
        </div>
    )
}

export default App