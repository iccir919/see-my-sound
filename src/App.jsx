import React, { useState, useEffect } from "react"
import Landing from "./components/Landing"
import Content from "./components/Content"
import './index.css'
import { fetchAccessToken } from "./utils/auth.js"

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const logout = () => {
        console.log("logging out...")
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        setIsLoggedIn(false)
    }

    useEffect(() => {
        // check if returning from Spotify auth
        const params = new URLSearchParams(window.location.search)
        const code = params.get("code")
        const error = params.get("error")

        if (error) {
            console.error("Error during authentication", error)
        } else if (code) {
            // exchange code for access token
            const codeVerifier = localStorage.getItem("code_verifier")
            if (codeVerifier) {
                fetchAccessToken(code, codeVerifier).then(tokenResponse => {
                    if (tokenResponse && tokenResponse.access_token) {
                        localStorage.setItem("access_token", tokenResponse.access_token)
                        if (tokenResponse.refresh_token) {
                            localStorage.setItem("refresh_token", tokenResponse.refresh_token)
                        }
                        localStorage.removeItem("code_verifier")
                        setIsLoggedIn(true)
                        window.history.replaceState({}, document.title, "/")
                    } else {
                        console.error("Failed to obtain access token")
                    }
                })
            }
            else {
                console.error("Code verifier not found in local storage")
            }
        } else {
            // check if already logged in
            const accessToken = localStorage.getItem("access_token")
            if (accessToken) {
                setIsLoggedIn(true)
            }
        }
    }, [])  

    return (
        <div id="app">
            {isLoggedIn ? <Content logout={logout} /> : <Landing />}
        </div>
    )
}

export default App