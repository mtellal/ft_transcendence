import React, { useState, useEffect, useRef, useCallback } from "react";

import { io } from 'socket.io-client';
import { useLocation } from "react-router-dom";
import { useCurrentUser } from "../../hooks/Hooks";
import { updateUser } from "../../requests/user";

import GameResult from "./GameResult";
import SearchGame from "./SearchGame";
import Play from "./Play";

import Game from "./Game";

import mario from '../../assets/mario.jpeg';
import sanic from '../../assets/sanic.jpeg';

import './Game.css'


function useImage(image: any) {
  const [_image, setImage]: any = useState();

  useEffect(() => {
    if (image) {
      let img = new Image();
      img.src = image;
      setImage(img);
    }
  }, [image]);

  return _image
}


export default function LaunchGame() {
  const location = useLocation();

  const { user, token, } = useCurrentUser();

  const [socket, setSocket] = useState(null);
  const [play, setPlay] = React.useState(false);
  const [gameRoom, setGameRoom] = useState(null);

  const [gameResult, setGameResult] = useState();
  const [gameFound, setGameFound] = useState(false);
  const [searchingGame, setSearchingGame] = useState(false);

  const [customization, setCustomization]: any = useState();

  const [connected, setConnected] = useState(false);

  const marioImage = useImage(mario);
  const sanicImage = useImage(sanic);

  const searchGame = useCallback((mode: string = "CLASSIC") => {
    if (socket && user) {
      setSearchingGame(true);
      socket.emit('join', {
        gametype: mode
      });
    }
  }, [socket, user]);


  useEffect(() => {
    if (socket && user) {
      socket.on('joinedGame', (joinedGame: any) => {
        if (joinedGame && joinedGame.player1Id && joinedGame.player2Id) {
          setGameFound(true);
          setSearchingGame(false);
          setGameRoom(joinedGame);
          if (user) {
            updateUser({ userStatus: "INGAME" }, user.id, token)
          }
          socket.off('joinedGame')
        }
      });
      return () => {
        socket.off('joinedGame');
      }
    }
  }, [socket, user, searchingGame])



  useEffect(() => {
    if (socket && user) {
      socket.on('finishedGame', (res: any) => {
        if (res) {
          setGameResult(res);
          if (user) {
            updateUser({ userStatus: "ONLINE" }, user.id, token)
          }
        }
      })

      if (location && location.state && location.state.gameId) {
        socket.emit('joinInvite', location.state.gameId)
      }

    }

    return () => {
      if (user)
        updateUser({ userStatus: "ONLINE" }, user.id, token)

      if (socket) {
        socket.off('finishedGame');
      }
    }

  }, [socket, user, location])


  useEffect(() => {
    if (token && user) {
      const s = io(`${process.env.REACT_APP_BACK}/game`, {
        transports: ['websocket'],
        extraHeaders: {
          'Authorization': `Bearer ${token}`
        }
      });

      setSocket(s);
      s.on('connect', () => {setConnected(true)})
      s.on('disconnect', () => {setConnected(false)})

      return () => {
        s.disconnect();
      }
    }
  }, [token, user]);


  const cancelSearchGame = useCallback(() => {
    if (socket) {
      setSearchingGame(false);
      socket.emit('cancel');
    }
  }, [socket, user]);


  function playAgain() {
    setPlay(false);
    setGameFound(false);
    setGameResult(null);
    setGameRoom(null);
    setCustomization(null);
  }

  return (
    <div className="launchgame relative">
      {
        connected && 
        <>
          {
            gameFound && socket && !gameResult &&
            <Game
              socket={socket}
              gameRoom={gameRoom}
              customization={customization}
              marioImage={marioImage}
              sanicImage={sanicImage}
            />
          }
          {searchingGame && <SearchGame cancelSearchGame={() => cancelSearchGame()} />}
          {
            !play && !searchingGame && !gameFound &&
            <Play
              searchGame={(mode: string) => searchGame(mode)}
              setCustomization={setCustomization}
            />
          }
          {
            gameResult &&
            <GameResult
              gameResult={gameResult}
              playAgain={playAgain}
            />
          }
        </>
      }
    </div>
  )
}

