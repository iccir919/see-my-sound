import { useEffect, useState } from "react"
import { redirectToSpotifyAuth, fetchAccessToken } from "./auth.js"

import Dashboard from "./components/Dashboard"
import spotifyLogo from "./assets/spotify_full_logo_white.svg"
import "./App.css"

export default function App() {

    const [accessToken, setAccessToken] = useState(localStorage.getItem("access_token"))

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const code = params.get("code")

        if (code && !accessToken) {
            const codeVerifier = localStorage.getItem("code_verifier")
            if (!codeVerifier) return
        

            fetchAccessToken(code, codeVerifier)
                .then((response) => {
                    console.log(response)
                    if (response.access_token) {
                        localStorage.setItem("access_token", response.access_token)
                        localStorage.setItem("refresh_token", response.refresh_token)
                        setAccessToken(response.access_token)
                        window.history.replaceState({}, document.title, "/")
                    }
                })
        }
    }, [accessToken])

    function handleLogout() {
        localStorage.clear()
        setAccessToken(null)
    }

    if (!accessToken) {
        return (
            <div className="landing">
                <h1>see my sound</h1>
                <p>a Spotify powered application</p>
                <button 
                    className="login-button" 
                    onClick={redirectToSpotifyAuth}
                >
                    Login with 
                    <img
                        src={spotifyLogo}
                        alt="Spotify logo"
                    />
                </button>
            </div>
        )
    }

    return <Dashboard onLogout={handleLogout} />
}