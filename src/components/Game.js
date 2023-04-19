import React, { useEffect } from "react";

import '../styles/Game.css'

let up;
let down;

export default function Game()
{
    const canvasRef = React.useRef();
    const animationID = React.useRef(0);
    const player1Ref = React.useRef({x:10, y:10, width:100, height:100})
    const player2Ref = React.useRef({x:10, y:10, width:100, height:100})

    function initCanvas(h, w)
    {
        const canvas = canvasRef.current;
        canvas.height = h;
        canvas.width = w;
    }

    function initPlayers(h, w)
    {
        const player1 = player1Ref.current;
        const player2 = player2Ref.current;

        player1.x = w * 0.02;
        player1.y = h * 0.05;
        player1.width = 10;
        player1.height = 100;

        player2.x = w - w * 0.03;
        player2.y = h * 0.05;
        player2.width = 10;
        player2.height = 100;
    }

    function resizeHandler(canvas)
    {
        const newDim = {
            width: canvas.parentNode.offsetWidth,
            height: canvas.parentNode.offsetHeight
        }

        initCanvas(newDim.height, newDim.width);
        initPlayers(newDim.height, newDim.width);
    }

    function handleKeyDown(e)
    {
        if (e.key === "w")
            up = 1;
        else if (e.key === "s")
            down = 1;
    }

    function handleKeyUp(e)
    {
        if (e.key === "w")
            up = 0;
        else if (e.key === "s")
            down = 0;
    }

    function drawPlayers(context)
    {
        const p1 = player1Ref.current;
        const p2 = player2Ref.current;
        
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
        context.beginPath();
        context.fillRect(p1.x, p1.y, p1.width, p1.height)
        context.fillRect(p2.x, p2.y, p2.width, p2.height)
    }

    function moveUp()
    {
        player1Ref.current.y -= 5;
    }

    function moveDown()
    {
        player1Ref.current.y += 5;
    }

    React.useEffect(() => {

        console.log("use effect []")

        const canvas = canvasRef.current;
        canvas.height = canvas.parentNode.offsetHeight;
        canvas.width = canvas.parentNode.offsetWidth;

        const context = canvas.getContext('2d');

        initPlayers(canvas.height, canvas.width);

        const game = () => {
            if (up)
                moveUp();
            else if (down)
                moveDown();
            drawPlayers(context);
            animationID.current = window.requestAnimationFrame(game);
        }


        game();
        return (() => {
            window.cancelAnimationFrame(animationID.current)
        })

    }, [])

    console.log("rendered")
    
    return (
        <div 
            className="game"
        >
            <canvas 
                ref={canvasRef} 
                className="game--canvas" 
                onKeyUp={handleKeyUp}
                onKeyDown={handleKeyDown}
                tabIndex="0"
            >

            </canvas>
        </div>
    )
}