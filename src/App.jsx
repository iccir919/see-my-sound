import React, { useEffect } from "react";
import { useSpotify } from "./context/SpotifyContext.jsx";
import { redirectToSpotifyAuth, fetchAccessToken } from "./utils/auth.js";
import Landing from "./components/Landing.jsx";
import Header from "./components/Header.jsx";
import FilterBar from "./components/FilterBar.jsx";
import TopList from "./components/TopList.jsx";
import "./index.css";

export default function App() {
    const {
        setAccessToken,
        setRefreshToken,
        isLoggedIn,
        setIsLoggedIn
    } = useSpotify();

    // On app load, check localStorage or exchange code from redirect
    useEffect( () => {
        // check stored tokens first
        const storedAccessToken = localStorage.getItem("access_token");
        const storedRefreshToken = localStorage.getItem("refresh_token");

        if (storedAccessToken) {
            setAccessToken(storedAccessToken);
            if (storedRefreshToken) setRefreshToken(storedRefreshToken);
            setIsLoggedIn(true);
            return;
        }

        // check for authorization code in URL
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        
        if (code) {
            const codeVerifier = localStorage.getItem("code_verifier");
            if (!codeVerifier) {
                console.error("Code verifier not found in localStorage");
                return;
            }

            fetchAccessToken(code, codeVerifier).then(data => {
                if (!data) return;

                localStorage.setItem("access_token", data.access_token);
                setAccessToken(data.access_token);

                if (data.refresh_token) {
                    localStorage.setItem("refresh_token", data.refresh_token);
                    setRefreshToken(data.refresh_token);    
                }

                setIsLoggedIn(true);
                localStorage.removeItem("code_verifier");
                window.history.replaceState({}, document.title, "/");   

                }).catch(err => {
                    console.error("Failed to exchange code,", err);
                })
        }

    }, [setAccessToken, setRefreshToken, setIsLoggedIn]);

    function handleLogout() {
        localStorage.clear();
        setAccessToken(null);
        setRefreshToken(null);
        setIsLoggedIn(false);
    }

    return (
        <div className="app">
            { !isLoggedIn ? 
                <Landing 
                    handleLogin={redirectToSpotifyAuth}
                /> 
                : (
                    <>
                        <Header onLogout={handleLogout} />
                        <main>
                            <FilterBar />
                            <TopList />
                        </main>
                    </>
                )
            }
        </div>
    )
}