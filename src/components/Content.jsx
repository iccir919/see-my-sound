import React from "react"
import TopArtists from "./TopArtists.jsx"

export default function Content({ accessToken, logout }) {
    return (
        <div id="content">
            <header>
                <div>
                    <h1>see my sound</h1>
                    <p>a Spotify powered application</p>
                </div>
                <button onClick={logout}>Log out</button>
            </header>
            <TopArtists accessToken={accessToken} />
        </div>
    )
}

