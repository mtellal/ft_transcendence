import React from "react";

import '../styles/Game.css'

export default function Game()
{
    const canvasRef = React.useRef();

    React.useEffect(() => {
        
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
    })
    
    return (
        <div className="game">
            <canvas ref={canvasRef} className="game--canvas">

            </canvas>
        </div>
    )
}