import React, { useEffect, useState } from "react";
import { useSpotify } from "./context/SpotifyContext.jsx";
import { redirectToSpotifyAuth, fetchAccessToken } from "./utils/auth.js";
import { tokenManager } from "./utils/tokenManager.js";
import Landing from "./components/Landing.jsx";
import Header from "./components/Header.jsx";
import FilterBar from "./components/FilterBar.jsx";
import TopList from "./components/TopList.jsx";
import "./index.css";

export default function App() {

    const {
        setIsLoggedIn,
        isLoggedIn
    } = useSpotify();

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        async function handleAuth() {


            try {
                const accessToken = tokenManager.getAccessToken();
                if (accessToken) {
                    setIsLoggedIn(true);
                    setIsLoading(false);
                    return;
                }

                const urlParams = new URLSearchParams(window.location.search);
                const code = urlParams.get("code");
                const authError = urlParams.get("error");

                if (authError) {
                    setError(`Authentication error: ${authError}`);
                    window.history.replaceState({}, document.title, "/");
                    setIsLoading(false);
                    return;
                }

                if (code) {
                    const codeVerifier = tokenManager.getCodeVerifier();
                    if (!codeVerifier) {
                        setError("Code verifier error. Please try logging in again.");
                        window.history.replaceState({}, document.title, "/");
                        setIsLoading(false);
                        return;
                    }

                    if (isLoading) await fetchAccessToken(code, codeVerifier);
                    setIsLoggedIn(true);

                    window.history.replaceState({}, document.title, "/");
                        
                }
            } catch (error) {
                console.error("Error checking access token:", error);
                setError(error.message || "Authentication failed");
            } finally {
                setIsLoading(false);
            }
        }

        if (isLoading) handleAuth();

    }, []);

    function handleLogin() {
        setError(null);
        redirectToSpotifyAuth()
    }

    function handleLogout() {
        tokenManager.clearAll();
        setIsLoggedIn(false);
        setError(null);
    }

    if (isLoading) {
        return (
            <div className="app">
                <div className="app-loading">
                    <p>Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="app">
            {error && (
                <div className="app-error-banner">
                    <span>{error}</span>
                    <button onClick={() => setError(null)}>x</button>
                </div>
            )}

            { !isLoggedIn ? 
                <Landing 
                    handleLogin={handleLogin}
                /> 
                : (
                    <>
                        <Header onLogout={handleLogout} />
                        <main>
                            <FilterBar />
                            <TopList onSessionExpired={handleLogout} />
                        </main>
                    </>
                )
            }
        </div>
    )
}