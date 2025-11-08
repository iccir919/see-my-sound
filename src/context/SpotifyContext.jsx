import React, { createContext, use, useContext, useState } from "react";

const SpotifyContext = createContext();

export function SpotifyProvider({ children }) {
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [type, setType] = useState("artists");
    const [timeRange, setTimeRange] = useState("medium_term");
    const [limit, setLimit] = useState(10);

    const [items, setItems] = useState([]);

    return (
        <SpotifyContext.Provider
            value={{
                accessToken,
                setAccessToken,
                refreshToken,
                setRefreshToken,
                isLoggedIn,
                setIsLoggedIn,
                type,
                setType,
                timeRange,
                setTimeRange,
                limit,
                setLimit,
                items,
                setItems,
            }}
        >
            {children}
        </SpotifyContext.Provider>
    )
}

export function useSpotify() {
    return useContext(SpotifyContext);
}