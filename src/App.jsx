import { useState, useEffect } from "react"
import { fetchAccessToken } from "./utils/auth.js"
import Landing from "./components/Landing"
import Content from "./components/Content"
import "./index.css"

const App = () => {
    const [accessToken, setAccessToken] = useState(null)

    useEffect(() => {

        const storedAccessToken = localStorage.getItem("access_token")
        if (storedAccessToken) {
            setAccessToken(storedAccessToken)
            return
        }

        // check if returning from Spotify auth
        const params = new URLSearchParams(window.location.search)
        const code = params.get("code")
        const error = params.get("error")

        if (error) {
            console.error("Spotify authorization error", error)
        } 
        
        if (code) {
            const codeVerifier = localStorage.getItem("code_verifier")
            if (!codeVerifier) {
                console.error("No code verifier found in local storage")
                return
            }

            
            fetchAccessToken(code, codeVerifier).then(data => {
                if (data) {
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
        localStorage.clear()
        setAccessToken(null)
    }

    return (
        <div className="app">
            {accessToken ? 
                (<Content
                    logout={logout} 
                />) : (<Landing />)}
        </div>
    )
}

export default App