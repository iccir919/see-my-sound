import React from "react"
import { redirectToSpotifyAuth } from "../utils/auth.js"

import spotifyLogo from "../assets/spotify_full_logo_white.svg"

export default function Landing() {
    return (
        <div id="landing">
            <h1>see my sound</h1>
            <p>a Spotify powered application</p>
            <button onClick={redirectToSpotifyAuth}>
                Log in with 
                <img src={spotifyLogo} alt="Spotify logo" />
            </button>
        </div>
    )
}