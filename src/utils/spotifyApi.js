import { refreshAccessToken  } from "./auth.js";

export async function fetchTopItems(type, timeRange, limit, accessToken, refreshToken, setAccessToken) {
  const url = `https://api.spotify.com/v1/me/top/${type}?time_range=${timeRange}&limit=${limit}`;

  let res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (res.status === 401 && refreshToken) {
    const newData = await refreshAccessToken(refreshToken);
    if (newData?.accessToken) {
      localStorage.setItem("access_token", newData.access_token);
      setAccessToken(newData.access_token);
      res = await fetch(url, {
        headers: { Authorization: `Bearer ${newData.access_token}` },
      });
    }
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Spotify API error: ${text}`);
  }

  const data = await res.json();
  return data.items;
}
