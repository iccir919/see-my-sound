import React, { createContext, useContext, useState, useCallback } from "react";

const SpotifyContext = createContext();

export function SpotifyProvider({ children }) {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [type, setType] = useState("artists");
    const [timeRange, setTimeRange] = useState("medium_term");
    const [limit, setLimit] = useState(10);

    const [items, setItemsState] = useState(null);

    const setItems = useCallback((newItems) => {
        setItemsState(newItems);
    }, []);

    return (
        <SpotifyContext.Provider
            value={{
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