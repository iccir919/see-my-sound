console.log("ui.js loaded")

import { redirectToSpotifyAuth } from "./auth.js"

document.addEventListener("DOMContentLoaded", () => {

    const content = document.getElementById("content")
    const landing = document.getElementById("landing")

    const loginBtn = document.getElementById("login-btn")
    const logoutBtn = null

    const accessToken = localStorage.getItem("access_token")

    if (accessToken) {
        landing.style.display = "none"
        content.style.display = "flex"
    } else {
        landing.style.display = "flex"
        content.style.display = "none"

        loginBtn.addEventListener("click", redirectToSpotifyAuth)
    }
})