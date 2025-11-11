import React, { useRef, useMemo } from "react";
import html2canvas from "html2canvas";
import { useSpotify } from "../context/SpotifyContext.jsx";

export default function CollageModal({ onClose }) {
    const { items } = useSpotify();
    const modalRef = useRef(null);

    const gridSize = useMemo(() => {
        const itemCount = Math.min(items.length, 25);
        if (itemCount <= 4) return 2;
        if (itemCount <= 9) return 3;
        if (itemCount <= 16) return 4;
        return 5;
    }, [items]);

    const handleDownload = async () => {
        if (!modalRef.current) return;

        const canvas = await html2canvas(modalRef.current, {
            useCORS: true,
            backgroundColor: "#121212",
            scale: 2,
        });
        const url = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = url;
        a.download = "see-my-sound-artist-collage.png";
        a.click();
    }
  
    return (
        <div className="modal-overlay">
            <div className="modal">
                <button className="modal-close-btn" onClick={onClose}>x</button>
                <h3>Your Artist Collage</h3>
                <div 
                    ref={modalRef} 
                    className="collage-grid" 
                    style={{ 
                        gridTemplateColumns: `repeat(${gridSize}, 1fr)`
                    }}
                >
                    {items.slice(0, gridSize * gridSize).map((artist, index) => {
                        return <img key={artist.id || index} src={artist.images?.[0]?.url} alt={artist.name} className="collage-img" />
                    })}
                </div>

                <div className="modal-actions">
                    <button className="btn-primary" onClick={handleDownload}>Download Collage</button>
                    <button className="btn-outline" onClick={onClose}>Close</button>
                </div>    
            </div>
        </div>
    );

}