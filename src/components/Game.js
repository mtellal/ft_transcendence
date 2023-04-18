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

    function drawPalyer(p1, color)
    {
        context.beginPath();
        context.fillRect(p1.x, p1.y, p1.width, p1.height);
        context.fillStyle = "black"
    }

    function moveUp(player)
    {
        console.log(player)
        const newPlayer = {
            ...player, 
            y: player.y - 5
        }

        setPlayers(prev => [newPlayer, prev[1]])
    }

    React.useEffect(() => {

        console.log("use effect []")
        const canvas = canvasRef.current;

        const newDim = {
            width: canvas.parentNode.offsetWidth,
            height: canvas.parentNode.offsetHeight
        }

        const cont = initCanvas(newDim.height, newDim.width);
        const p = initPlayers(newDim.height, newDim.width);

        window.addEventListener("resize", (e) => {
            const newDim = {
                width: canvasRef.current.parentNode.offsetWidth,
                height: canvasRef.current.parentNode.offsetHeight
            }

            initCanvas(newDim.height, newDim.width);
            initPlayers(newDim.height, newDim.width)

        })

    }, [])

    function salut(e)
    {
        console.log("salut")
    }

    React.useEffect(() => {
        console.log("use effect ")
        players.map(p => drawPalyer(p))
    }, [players])
    
    return (
        <div className="game"
            onKeyUp={salut}
            onResize={salut}
        >
            <canvas 
                ref={canvasRef} 
                className="game--canvas" 
                onKeyUp={e => console.log("wdfwfw")}
            >

            </canvas>
        </div>
    )
}