import React, {useState, useEffect} from "react";

import './Game.css'
import { io, Socket } from 'socket.io-client';
import { Outlet, useNavigate, useOutletContext } from "react-router-dom";

let up : boolean;
let down : boolean;

function Game(props : any)
{
    const canvasRef : any  = React.useRef();
    const animationID = React.useRef(0);
    const player1Ref = React.useRef({x:10, y:10, width:100, height:100})
    const player2Ref = React.useRef({x:10, y:10, width:100, height:100})
    const ballRef = React.useRef({x:0, y:0, velx:0, vely:0, radius:0})

    const [scores, setScores] = React.useState({p1:0, p2:0})

    function initPlayers(canvasHeight : any , canvasWidth : any )
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

    function initBall(canvasHeight : any , canvasWidth : any )
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


    function drawPlayers(context : any )
    {
        const p1 = player1Ref.current;
        const p2 = player2Ref.current;
        
        context.beginPath();
        context.fillRect(p1.x, p1.y, p1.width, p1.height)
        context.fillRect(p2.x, p2.y, p2.width, p2.height)
    }

    function drawBall(context : any )
    {
        const ball = ballRef.current;
        context.beginPath();
        context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        context.fill();
    }

    function drawPlayground(context : any )
    {
        const canvas : any = canvasRef.current;

        context.beginPath();
        context.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2);
        context.fillStyle = '#FFD8B8'
        context.fill();
        context.stroke();
        context.fillStyle = 'black'
        context.fillRect(canvas.width / 2, 0, 1, canvas.height)
    }


    function draw(context : any )
    {
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
        drawPlayground(context)
        drawPlayers(context);
        drawBall(context);
    }

    /* //////////   MOVEMENTS FUNCTIONS     //////////*/

    function handleKeyDown(e : any)
    {
        if (e.key === "w")
            up = true;
        else if (e.key === "s")
            down = true;
    }

    function handleKeyUp(e : any)
    {
        if (e.key === "w")
            up = false;
        else if (e.key === "s")
            down = false;
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

    function movePlayer()
    {
        if (up)
            moveUp();
        else if (down)
            moveDown();
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
            if (nextPosX < 0)
                setScores(prev => ({...prev, p2: prev.p2 + 1}))
            else if (nextPosX > canvas.width)
                setScores(prev => ({...prev, p1: prev.p1 + 1}))

            initBall(canvas.height, canvas.width);
            return (1);
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
        return (0)
    }

    function resizeHandler(context : any) 
    {
        const canvas = canvasRef.current;
        const width = canvas.parentNode.offsetWidth;
        const height = canvas.parentNode.offsetHeight;

        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width
          canvas.height = height
        }
        
        initGame(canvas, context)
    }

    function initGame(canvas : any, context : any)
    {
        canvas.height = canvas.parentNode.offsetHeight;
        canvas.width = canvas.parentNode.offsetWidth;

        initPlayers(canvas.height, canvas.width);
        initBall(canvas.height, canvas.width);
        draw(context);

    }

    React.useEffect(() => {
        
        let newgame;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

       initGame(canvas, context)

       const resizeEvent = () => resizeHandler(context);

        window.addEventListener('resize', resizeEvent);

        const game = () => {
            
            movePlayer();
            draw(context);
            newgame = moveBall();
            if (newgame)
            {
                draw(context);
                setTimeout(() => {
                    animationID.current = window.requestAnimationFrame(game);
                }, 1000);
            }
            else
                animationID.current = window.requestAnimationFrame(game);
                
        }

        if (props.launch)
            game();

        return (() => {
            window.cancelAnimationFrame(animationID.current);
            window.removeEventListener('resize', resizeEvent);
        })

    }, [props.launch])


    return (
        <div className="game">
            <div className="score--container">
                <p className="score">{scores.p1}</p>
                <p className="score">{scores.p2}</p>
            </div>

            <canvas 
                ref={canvasRef} 
                className="game--canvas" 
                onKeyUp={handleKeyUp}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                >

            </canvas>
        </div>
    )
}

function PlayPage(props) {
    const { user, token } = useOutletContext();
    const [socket, setSocket] = useState(null);
  
    const handlePlayClick = () => {
      const s = io('http://localhost:3000/game', {
        transports: ['websocket'],
        extraHeaders: {
          'Authorization': `Bearer ${token}`
        }
      });
      setSocket(s);
      props.click();
      s.emit('joinGame', '');
      console.log("Emitting event here");
    };
  
    useEffect(() => {
        if (socket) {
          // Perform any necessary socket operations here
          console.log('Socket connected:', socket.id);
    
          // Clean up the socket connection when the component unmounts
          return () => {
            console.log('Socket disconnected:', socket.id);
            socket.disconnect();
          };
        }
      }, [socket]);
  
    return (
      <div className="play-page">
        <button onClick={handlePlayClick} className="play-button">
          Play
        </button>
      </div>
    );
  }


export default function LaunchGame()
{
    const [play, setPlay] = React.useState(false);

    return (
        <>
            <Game launch={play}/>
            {!play && <PlayPage click={() => setPlay(true)} />}
        </>
    )
}
