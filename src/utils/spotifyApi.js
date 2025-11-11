import { getValidAccessToken } from "./auth.js";


export async function spotifyRequest(url, options = {}) {
  try {
    const accessToken = await getValidAccessToken();

    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (response.status === 401) {
      throw new Error("SESSION_EXPIRED");
    }

    if (response.status === 403) {
      throw new Error("ACCESS_FORBIDDEN");
    }    

    if (response.status === 429) {
      const retryAfter = response.headers.get("Retry-After") || 1;
      console.warn(`Rate limited by Spotify API. Retrying after ${retryAfter} seconds.`);
      throw new Error(`RATE_LIMITED:${retryAfter}`);
    }

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Spotify API request failed: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Spotify API request error:", error);
    throw error;
  }
}

export async function fetchTopItems(type, timeRange, limit) {
  const url = `https://api.spotify.com/v1/me/top/${type}?time_range=${timeRange}&limit=${limit}`;
  const data = await spotifyRequest(url);
  return data.items || [];
}

export async function getCurrentUser() {
  return await spotifyRequest("https://api.spotify.com/v1/me");
}

export async function createPlaylist(userId, name, description, isPublic = true) {
  const url = `https://api.spotify.com/v1/users/${userId}/playlists`;
  const body = {
    name,
    description,
    public: isPublic,
  };

  return await spotifyRequest(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}


export async function addTracksToPlaylist(playlistId, trackUris) {
  const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
  const body = {
    uris: trackUris,
  };

  return await spotifyRequest(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function createPlaylistWithTracks(name, description, trackUris) {
  const user = await getCurrentUser();

  const playlist = await createPlaylist(user.id, name, description);

  if (trackUris.length > 0) {
    await addTracksToPlaylist(playlist.id, trackUris);
  }

  return playlist;
} 