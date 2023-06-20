import React, {useState, useEffect, useRef} from "react";

import './Game.css'
import { io, Socket } from 'socket.io-client';
import { Outlet, useNavigate, useOutletContext } from "react-router-dom";

let up : boolean;
let down : boolean;


function Game(props: any)
{
    const canvasRef : any  = React.useRef();

    const token =  useOutletContext();
    const [socket, setSocket] = useState(null);
    const [gameRoom, setGameRoom] = useState(null);
    const [gameState, setGameState] = useState(null);

    useEffect(() => {
        const s = io('http://localhost:3000/game', {
            transports: ['websocket'],
            extraHeaders: {
                'Authorization': `Bearer ${token}`
            }
        });
        setSocket(s);
        s.emit('join', {
          gametype: "SPEEDUP"
        });
        s.on('joinedGame', (joinedGame) => {
            setGameRoom(joinedGame);
        });
        s.on('updatedState', (updatedGameState) => {
            setGameState(updatedGameState);
            console.log(updatedGameState);
            drawGameState(updatedGameState);
        })
        return () => {
            s.disconnect();
        }
    }, []);

    function drawGameState(gameState) {
        const context = canvasRef.current.getContext('2d');
        canvasRef.current.width = 1600;
        canvasRef.current.height = 800;

        /* context.clearRect(0, 0, 1600, 800); */

        const { player1, player2, ball, scores } = gameState;

        console.log(gameState);
        context.beginPath();
        context.fillRect(gameState.player1.x, gameState.player1.y, gameState.player1.width, gameState.player1.height);
        context.fillRect(gameState.player2.x, gameState.player2.y, gameState.player2.width, gameState.player2.height);

        context.beginPath();
        context.arc(gameState.ball.x, gameState.ball.y, gameState.ball.radius, 0, Math.PI * 2);
        context.fill();

        context.beginPath();
        context.arc(gameState.width / 2, gameState.height / 2, 50, 0, Math.PI * 2);
        context.fillStyle = '#FFD8B8';
        context.fill();
        context.stroke();
        context.fillStyle = 'black';
        context.fillRect(gameState.width / 2, 0, 1, gameState.height);

        // Render scores
        context.fillStyle = 'black';
        context.font = '24px Arial';
        context.fillText(`P1: ${gameState.score.player1Score}`, 20, 40);
        context.fillText(`P2: ${gameState.score.player2Score}`, canvasRef.current.width - 80, 40);
    }

    /* //////////   MOVEMENTS FUNCTIONS     //////////*/

    const handleKeyDown = (e: any) => {
        if (e.key === "w") {
          moveUp();
        } else if (e.key === "s") {
          moveDown();
        }
      };
    
      const moveUp = () => {
        socket.emit("moveUp", gameRoom?.id);
      };
    
      const moveDown = () => {
        socket.emit("moveDown", gameRoom?.id);
      };

    return (
        <div className="game">
            <canvas 
                ref={canvasRef} 
                className="game--canvas" 
                //onKeyUp={handleKeyUp}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                >

            </canvas>
        </div>
    )
}

function PlayPage(props: any) {

    return (
      <div className="play-page">
        <button onClick={props.click} className="play-button">
          Play
        </button>
      </div>
    );
  }


export default function LaunchGame()
{
    const [play, setPlay] = React.useState(false);

    return (
        <div className="launchgame relative">
            <Game launch={play}/>
            {!play && <PlayPage click={() => setPlay(true)} />}
        </div>
    )
}
