import React from "react";


export default function Header({ onLogout }) {

    return (
        <header>
            <div className="header-left">
                <h1>See My Sound</h1>
            </div>

            <div className="header-right">
                <button 
                    className="btn-outline"
                    onClick={onLogout}
                >
                    Logout
                </button>
            </div>
        </header>
    )

}