import React, { useState, useEffect, useCallback } from "react";

import { io } from 'socket.io-client';
import { useLocation } from "react-router-dom";
import { useCurrentUser } from "../../hooks/Hooks";
import { updateUser } from "../../requests/user";

import GameResult from "./GameResult";
import SearchGame from "./SearchGame";
import Play from "./Play";

import Game from "./Game";

import space from '../../assets/space.jpg';
import speed from '../../assets/speed.jpg';
import focus from '../../assets/focus.jpg';

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

   const spaceImage = useImage(space);
   const speedImage = useImage(speed);
   const focusImage = useImage(focus);

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
               if (user && token) {
                  updateUser({ userStatus: "INGAME" }, user.id, token)
               }
               socket.off('joinedGame')
            }
         });
         return () => {
            socket.off('joinedGame');
         }
      }
   }, [socket, user, searchingGame, token])



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
         if (user && token)
            updateUser({ userStatus: "ONLINE" }, user.id, token)

         if (socket) {
            socket.off('finishedGame');
         }
      }

   }, [socket, user, location, token])


   useEffect(() => {
      if (token && user && !localStorage.getItem("chatSocket")) {
         const s = io(`${process.env.REACT_APP_BACK}/game`, {
            transports: ['websocket'],
            upgrade: false,
            extraHeaders: {
               'Authorization': `Bearer ${token}`
            }
         });

         setSocket(s);
         s.on('connect', () => { setConnected(true) })
         s.on('disconnect', () => { setConnected(false) })

         return () => {
            s.disconnect();
         }
      }
   }, [token]);


   const cancelSearchGame = useCallback(() => {
      if (socket) {
         setSearchingGame(false);
         socket.emit('cancel');
      }
   }, [socket]);


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
                     spaceImage={spaceImage}
                     speedImage={speedImage}
                     focusImage={focusImage}
                     ballColor={customization ? "white" : "black"}
                     playerColor={customization ? "white" : "black"}
                     scoreColor={customization ? "white" : "black"}
                  />
               }
               {searchingGame && <SearchGame cancelSearchGame={() => cancelSearchGame()} />}
               {
                  !play && !searchingGame && !gameFound &&
                  <Play
                     searchGame={(mode: string) => searchGame(mode)}
                     customization={customization}
                     setCustomization={setCustomization}
                  >

                  </Play>
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

