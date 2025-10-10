import TopArtists from "./TopArtists.jsx"
import TopTracks from "./TopTracks.jsx"

const Content = ({ logout }) => {
    return (
        <div className="content">
            <header>
                <div>
                    <h1>see my sound</h1>
                    <p>a Spotify powered application</p>
                </div>
                <button onClick={logout}>Log out</button>
            </header>

            <section>
                <TopArtists />
            </section>

            <section>
                <TopTracks />
            </section>
        </div>
    )
}

export default Content