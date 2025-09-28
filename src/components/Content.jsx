import React from "react"

const Content = (props) => {
    return (
        <div id="content">
            <header>
                <div>
                    <h1>see my sound</h1>
                    <p>a Spotify powered application</p>
                </div>
                <button onClick={props.logout}>Log out</button>
            </header>
        </div>
    )
}

export default Content