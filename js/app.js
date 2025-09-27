console.log("app.js loaded")

import { redirectToSpotifyAuth } from "./auth.js"
import { fetchSpotifyData } from "./api.js"

const loginBtn = document.getElementById("login-btn")
const logoutBtn = document.getElementById("logout-btn")
const content = document.getElementById("content")
const landing = document.getElementById("landing")
const topArtistsList = document.getElementById("top-artists")

loginBtn.addEventListener("click", () => {
    console.log("login button clicked")
    redirectToSpotifyAuth()
})

logoutBtn.addEventListener("click", () => {
    localStorage.clear()
    window.location.reload()
})

const showTopArtists = async () => {
    const data = await fetchSpotifyData("me/top/artists?limit=10&time_range=long_term")
    console.log("Top artists response:", data)

    if (data && data.items) {
        topArtistsList.innerHTML = ""
        data.items.forEach(artist => {
            const li = document.createElement("li")
            const img = document.createElement("img")
            img.src = artist.images[0]?.url || ""
            img.alt = artist.name
            const name = document.createElement("span")
            name.textContent = artist.name
            li.appendChild(img)
            li.appendChild(name)
            topArtistsList.appendChild(li)
        })
    } else {
        topArtistsList.innerHTML = "<li>Failed to load top artists</li>"
    }
}

const init = () => {
    const accessToken = localStorage.getItem("access_token")
    if (accessToken) {
        landing.style.display = "none"
        content.style.display = "flex"
        showTopArtists()
    } else {
        landing.style.display = "flex"
        content.style.display = "none"
    }
}

document.addEventListener("DOMContentLoaded", () => {
    init()
})

