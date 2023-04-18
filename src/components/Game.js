import React, { useEffect } from "react";

import '../styles/Game.css'

export default function Game()
{
    const canvasRef = React.useRef();
    const [players, setPlayers] = React.useState([])
    const [context, setContext] = React.useState();

    function initCanvas(h, w)
    {
        const canvas = canvasRef.current;
        canvas.height = h;
        canvas.width = w;
        setContext(canvas.getContext('2d'));
    }

    function initPlayers(h, w)
    {
        const player1 = {
            x: w * 0.02, 
            y: h * 0.05,
            width: 10,
            height: 100,
        }

        const player2 = {
            x: w - w * 0.03, 
            y: h * 0.05,
            width: 10,
            height: 100,
        }

        setPlayers([player1, player2])
    }

    function drawPalyer(p1)
    {
        context.beginPath();
        context.fillRect(p1.x, p1.y, p1.width, p1.height);
    }

    React.useEffect(() => {

        console.log("use effect []")
        const canvas = canvasRef.current;

        const newDim = {
            width: canvas.parentNode.offsetWidth,
            height: canvas.parentNode.offsetHeight
        }

        const cont = initCanvas(newDim.height, newDim.width);
        initPlayers(newDim.height, newDim.width);

        window.addEventListener("resize", (e) => {
            const newDim = {
                width: canvasRef.current.parentNode.offsetWidth,
                height: canvasRef.current.parentNode.offsetHeight
            }

            initCanvas(newDim.height, newDim.width);
            initPlayers(newDim.height, newDim.width)

        })

        document.addEventListener("keypress", e => {
            console.log(e.key)
            if (e.keyCode === 38)
            {
                console.log("up")
            }

        })

    }, [])

    React.useEffect(() => {
        console.log("use effect ")
        if (players.length)
            players.map(p => drawPalyer(p))
    })
    
    return (
        <div className="game">
            <canvas 
                ref={canvasRef} 
                className="game--canvas" 
            >

            </canvas>
        </div>
    )
}