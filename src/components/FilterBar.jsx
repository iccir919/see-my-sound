import React from "react";
import { useSpotify } from "../context/SpotifyContext.jsx";

export default function FilterBar() {
    const {
        type,
        setType,
        timeRange,
        setTimeRange,
        limit,
        setLimit
    } = useSpotify();

    return (
        <div className="filter-bar">
            <p className="sentence">
                My top 
                <select className="inline-select" value={limit} onChange={e => setLimit(Number(e.target.value))}>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>

                <select className="inline-select" value={type} onChange={e => setType(e.target.value)}>
                    <option value="tracks">tracks</option>
                    <option value="artists">artists</option>
                </select>

                from the last 
                <select className="inline-select" value={timeRange} onChange={e => setTimeRange(e.target.value)}>
                    <option value="short_term">4 weeks</option>
                    <option value="medium_term">6 months</option>
                    <option value="long_term">several years</option>
                </select>
            </p>
        </div>
    );
}