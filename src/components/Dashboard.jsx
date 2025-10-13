import { useState } from "react"

import TopList from "./TopList"

export default function Dashboard({ onLogout }) {
    const [type, setType] = useState("artists")
    const [timeRange, setTimeRange] = useState("medium_term")
    const [limit, setLimit] = useState(10)

    return (
        <div className="dashboard">
            <div className="header">
                <h1>see my sound</h1>
                <button onClick={onLogout}>Logout</button>
            </div>

            <div className="filters">
                <p>
                    my{" "}
                    <select 
                        value={limit} 
                        onChange={(e) => setLimit(e.target.value)}
                    >
                        <option value="5">top 5</option>
                        <option value="10">top 10</option>
                        <option value="20">top 20</option>
                    </select>{" "}
                    <select 
                        value={type} 
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="artists">artists</option>
                        <option value="tracks">tracks</option>
                    </select>{" "}
                    from the {" "}
                    <select 
                        value={timeRange} 
                        onChange={((e) => setTimeRange(e.target.value))}
                    >
                        <option value="short_term">last 4 weeks</option>
                        <option value="medium_term">last 6 months</option>
                        <option value="long_term">all time</option>
                    </select>
                </p>
            </div>

            <TopList 
                type={type} 
                timeRange={timeRange}
                limit={limit}
            />
        </div>
    )
}