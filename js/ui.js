console.log("ui.js loaded")

document.addEventListener("DOMContentLoaded", () => {
    const landing = document.getElementById("landing")
    const content = document.getElementById("content")

    if (localStorage.getItem("access_token")) {
        landing.style.display = "none"
        content.style.display = "flex"
    } else {
        landing.style.display = "flex"
        content.style.display = "none"
    }

})