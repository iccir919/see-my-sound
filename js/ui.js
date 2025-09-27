console.log("ui.js loaded")

import { redirectToSpotifyAuth, logout } from "./auth.js"
import { fetchSpotifyApi } from "./api.js"

const showTopArtists = async () => {
    const data = await fetchSpotifyApi("me/top/artists?limit=10&time_range=long_term")
    const list = document.getElementById("top-artists")
    list.innerHTML = ""

    data.items.forEach(artist => {
        const li = document.createElement("li")
        const img = document.createElement("img")

        img.src = artist.images[0]?.url || ""
        img.alt = artist.name

        const name = document.createElement("span")
        name.textContent = artist.name

        li.appendChild(img)
        li.appendChild(name)
        list.appendChild(li)
    })
}


document.addEventListener("DOMContentLoaded", () => {

    const content = document.getElementById("content")
    const landing = document.getElementById("landing")

    const loginBtn = document.getElementById("login-btn")
    const logoutBtn = document.getElementById("logout-btn")

    const accessToken = localStorage.getItem("access_token")

    if (accessToken) {
        landing.style.display = "none"
        content.style.display = "flex"

        showTopArtists()

        logoutBtn.addEventListener("click", logout) 
    } else {
        landing.style.display = "flex"
        content.style.display = "none"

        loginBtn.addEventListener("click", redirectToSpotifyAuth)
    }
})