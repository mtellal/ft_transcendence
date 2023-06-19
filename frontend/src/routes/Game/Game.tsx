import React, { useState, useEffect, useRef, useCallback } from "react";

import { io, Socket } from 'socket.io-client';
import { Outlet, useNavigate, useOutletContext } from "react-router-dom";
import { useCurrentUser } from "../../hooks/Hooks";
import './Game.css'

let up: boolean;
let down: boolean;


function Game(props: any) {
  const canvasRef: any = React.useRef();

  const token = useOutletContext();
  const [socket, setSocket] = useState(null);
  const [gameRoom, setGameRoom] = useState(null);

  const [context, setContext]: any = useState();

  const [scoreP1, setScoreP1] = useState(0);
  const [scoreP2, setScoreP2] = useState(0);

  const [ratioHeight, setRatioHeight] = useState(1);
  const [ratioWidth, setRatioWidth] = useState(1);

  useEffect(() => {
    initContext();
  }, [])

  useEffect(() => {
    if (canvasRef && canvasRef.current)
    {
      window.addEventListener('resize', initContext)
      return () => window.removeEventListener('resize', initContext);
    }
  }, [canvasRef])

  useEffect(() => {
    if (props.gameRoom)
      setGameRoom(props.gameRoom);
  }, [props.gameRoom])

  useEffect(() => {
    if (props.socket && context) {
      setSocket(props.socket);
      props.socket.on('updatedState', (updatedGameState: any) => {
        drawGameState(updatedGameState);
      })
      return () => props.socket.off('updatedState')
    }
  }, [props.socket, context, ratioHeight, ratioWidth]);


  function initContext() {
    const context = canvasRef.current.getContext('2d');
    setContext(context);
    setRatioWidth(canvasRef.current.clientWidth / 1600);
    setRatioHeight(canvasRef.current.clientHeight / 800);
    canvasRef.current.width =  canvasRef.current.clientWidth;
    canvasRef.current.height = canvasRef.current.clientHeight;
  }

  function drawBall(context: any, x: number, y: number, radius: number) {
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }

  function drawPlayers(context: any, player1: any, player2: any, ratioHeight: number, ratioWidth: number) {
    context.beginPath();
    context.fillRect(player1.x * ratioWidth, player1.y * ratioHeight, player1.width * ratioWidth, player1.height * ratioHeight);
    context.fillRect(player2.x * ratioWidth, player2.y * ratioHeight, player2.width * ratioWidth, player2.height * ratioHeight);
  }

  function drawField(context: any, width: number, height: number) {
    context.beginPath();
    context.arc(width / 2, height / 2, 50, 0, Math.PI * 2);
    context.fillStyle = '#FFD8B8';
    context.fill();
    context.stroke();
    context.fillStyle = 'black';
    context.fillRect(width / 2, 0, 1, height);

  }

  const drawGameState = useCallback((gameState: any) => {
    if (context && canvasRef && canvasRef.current && ratioHeight && ratioWidth) {
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      drawField(context, canvasRef.current.width, canvasRef.current.height)

      drawPlayers(context, gameState.player1, gameState.player2, ratioHeight, ratioWidth)
      drawBall(context, gameState.ball.x * ratioWidth, gameState.ball.y * ratioHeight, gameState.ball.radius * ratioWidth);


      setScoreP1((p: number) => p !== gameState.score.player1Score ? gameState.score.player1Score : p);
      setScoreP2((p: number) => p !== gameState.score.player2Score ? gameState.score.player2Score : p);

    }
  }, [context, canvasRef, ratioHeight, ratioWidth]);

  /* //////////   MOVEMENTS FUNCTIONS     //////////*/

  const handleKeyDown = (e: any) => {
    if (e.key === "w") {
      moveUp();
    } else if (e.key === "s") {
      moveDown();
    }
  };


  const moveUp = useCallback(() => {
    if (socket) {
      socket.emit("moveUp", gameRoom?.id);
    }
  }, [socket]);

  const moveDown = useCallback(() => {
    if (socket)
      socket.emit("moveDown", gameRoom?.id);
  }, [socket]);

  return (
    <div className="game relative">
      <canvas
        ref={canvasRef}
        className="game--canvas"
        //onKeyUp={handleKeyUp}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      />
      <div className="absolute" style={{ top: '10px', left: '30px', fontSize: 'x-large' }}>
        <p>{scoreP1}</p>
      </div>
      <div className="absolute " style={{ top: '10px', right: '30px', fontSize: 'x-large'  }}>
        <p>{scoreP2}</p>
      </div>
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

function SearchGame(props: any) {

  const [points, setPoints] = useState("");

  useEffect(() => {
    const id = setInterval(() => {
      if (points.length > 6)
        setPoints("");
      else
        setPoints((p: string) => p += ". ")
    }, 1000)
    return () => clearInterval(id);
  }, [points])


  return (
    <div className="play-page">
      <button className="play-button">
        Searching a game {points}
      </button>
    </div>
  );
}

export default function LaunchGame() {
  const [play, setPlay] = React.useState(false);

  const { user, token } = useCurrentUser();

  const [socket, setSocket] = useState(null);
  const [gameRoom, setGameRoom] = useState(null);
  const [gameState, setGameState] = useState(null);

  const [searchingGame, setSearchingGame] = useState(false);
  const [gameFound, setGameFound] = useState(false);

  const searchGame = useCallback(() => {
    if (socket) {
      setSearchingGame(true);
      socket.emit('join', {
        gametype: "CLASSIC"
      });
      socket.on('joinedGame', (joinedGame: any) => {
        if (joinedGame && joinedGame.player1Id && joinedGame.player2Id) {
          setGameFound(true);
          setSearchingGame(false);
          setGameRoom(joinedGame);
          socket.off('joinedGame')
        }
      });
    }
  }, [socket]);


  useEffect(() => {
    const s = io('http://localhost:3000/game', {
      transports: ['websocket'],
      extraHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });

    setSocket(s);

    return () => {
      s.disconnect();
    }
  }, []);


  return (
    <div className="launchgame relative">
      {gameFound && socket && <Game launch={gameFound} socket={socket} gameRoom={gameRoom} />}
      {searchingGame && <SearchGame />}
      {!play && !searchingGame && !gameFound && <PlayPage click={() => searchGame()} />}
    </div>
  )
}
