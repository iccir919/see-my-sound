export default function Landing({handleLogin}) {
    return (
        <div className="landing">
            <h1>See My Sound</h1>
            <button 
                className="btn-primary"
                onClick={handleLogin}
            >
                Log in with Spotify
            </button>
        </div>
    )   
}