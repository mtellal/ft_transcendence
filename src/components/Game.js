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
    const ballRef = React.useRef({x:0, y:0, velx:0, vely:0, radius:0})

    function initPlayers(canvasHeight, canvasWidth)
    {
        const player1 = player1Ref.current;
        const player2 = player2Ref.current;

        player1.width = 10;
        player1.height = 100;
        player1.x = canvasWidth * 0.02;
        player1.y = canvasHeight / 2 - player1.height;

        player2.width = 10;
        player2.height = 100;
        player2.x = canvasWidth - canvasWidth * 0.03;
        player2.y = canvasHeight / 2 - player2.height;
    }

    function initBall(canvasHeight, canvasWidth)
    {
        const ball = ballRef.current;
        const signx = Math.floor(Math.random() * 10) % 2 === 0 ? 0 : 1;
        const signy = Math.floor(Math.random() * 10) % 2 === 0 ? 0 : 1;

        ball.x = canvasWidth / 2;
        ball.y = canvasHeight / 2;
        ball.velx = signx ? Math.floor(Math.random() * 2) + 1 : -1 * (Math.floor(Math.random() * 2) + 1) 
        ball.vely = signy ? Math.floor(Math.random() * 2) + 1 : -1 * (Math.floor(Math.random() * 2) + 1) 

        ball.radius = 10;
    }


    /* //////////   DRAW FUNCTIONS     //////////*/


    function drawPlayers(context)
    {
        const p1 = player1Ref.current;
        const p2 = player2Ref.current;
        
        context.beginPath();
        context.fillRect(p1.x, p1.y, p1.width, p1.height)
        context.fillRect(p2.x, p2.y, p2.width, p2.height)
    }

    function drawBall(context)
    {
        const ball = ballRef.current;
        context.beginPath();
        context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        context.fill();
    }

    function draw(context)
    {
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
        drawPlayers(context);
        drawBall(context);
    }

    /* //////////   MOVEMENTS FUNCTIONS     //////////*/

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

    function moveUp()
    {
        if (player1Ref.current.y - 5 > 0)
            player1Ref.current.y -= 5;
    }

    function moveDown()
    {
        const p1 = player1Ref.current;
        if (p1.y + 5 + p1.height < canvasRef.current.height)
            p1.y += 5;
    }

    function moveBall()
    {
        const canvas = canvasRef.current;
        const ball = ballRef.current;
        const player1 = player1Ref.current;
        const player2 = player2Ref.current;

        let nextPosX = ball.x + ball.velx;
        nextPosX += ball.velx > 0 ? ball.radius : -ball.radius; 
        let nextPosY = ball.y + ball.vely;
        nextPosY += ball.vely > 0 ? ball.radius : -ball.radius; 

        if ((nextPosX > player1.x && nextPosX < player1.x + player1.width &&
                nextPosY > player1.y && nextPosY < player1.y + player1.height) || 
                (nextPosX > player2.x && nextPosX < player2.x + player2.width &&
                    nextPosY > player2.y && nextPosY < player2.y + player2.height))
        {
            ball.velx *= -1;
        }

        if (nextPosX < 0 || nextPosX > canvas.width)
        {
            initBall(canvas.height, canvas.width);
        }
        if (nextPosY < 0 || nextPosY > canvas.height)
        {
            ball.vely *= -1;
        }
        else
        {
            ball.x += ball.velx;
            ball.y += ball.vely;
        }


    }


    React.useEffect(() => {

        const canvas = canvasRef.current;
        canvas.height = canvas.parentNode.offsetHeight;
        canvas.width = canvas.parentNode.offsetWidth;

        const context = canvas.getContext('2d');

        initPlayers(canvas.height, canvas.width);
        initBall(canvas.height, canvas.width);

        const game = () => {
            if (up)
                moveUp();
            else if (down)
                moveDown();
            draw(context);
            moveBall();
            animationID.current = window.requestAnimationFrame(game);
        }

        game();
        
        return (() => {
            window.cancelAnimationFrame(animationID.current);
        })

    }, [])

    
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