console.log("spotify.js loaded")

import { refreshAccessToken } from "../auth.js"

export async function fetchWithAuth(url) {
    const accessToken = localStorage.getItem("access_token")
    const refreshToken = localStorage.getItem("refresh_token")

    let response = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` }
    })

    if (response.status == 401 && refreshToken) {
        const refreshResponse = await refreshAccessToken(refreshToken)

        if (refreshResponse.status === 401 && refreshToken) {
            localStorage.setItem("access_token", refreshResponse.accessToken)

            response = await fetch(url, {
                headers: { Authorization: `Bearer ${refreshResponse.accessToken}`}
            })
        }
    }

    return response
}