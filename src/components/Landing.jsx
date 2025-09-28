import React from "react"
import { redirectToSpotifyAuth } from "../utils/auth.js"

export default function Landing() {
    return (
        <div id="landing">
            <h1>see my sound</h1>
            <p>a Spotify powered application</p>
            <button onClick={redirectToSpotifyAuth}>Log in with Spotify</button>
        </div>
    )
}