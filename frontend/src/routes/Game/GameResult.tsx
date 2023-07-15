import React, { useState, useEffect, useCallback } from "react";

import { useCurrentUser } from "../../hooks/Hooks";
import useFetchUsers from "../../hooks/useFetchUsers";
import ProfilePicture from "../../components/users/ProfilePicture";

import { Game } from "../../types";

import crown from '../../assets/crown.svg'
import win from '../../assets/win.jpg'

import './Game.css'
import './GameResult.css'

type TGameResult = {
   gameResult: Game,
   playAgain: () => void
}

export default function GameResult(props: TGameResult) {

   const [player, setPlayer]: any = useState();

   const { user } = useCurrentUser();
   const { fetchUser } = useFetchUsers();

   const loadPlayers = useCallback(async (gameResult: any) => {
      let p;
      if (gameResult.player1Id === user.id)
         p = await fetchUser(gameResult.player2Id);
      else
         p = await fetchUser(gameResult.player1Id);
      setPlayer(p);
   }, [fetchUser, user]);

   useEffect(() => {
      if (props.gameResult) {
         loadPlayers(props.gameResult);
      }
   }, [props.gameResult, loadPlayers])

   return (
      <div className="play-page">
         {
            props.gameResult && player && user &&
            <div className="flex-column-center label white gameresult-label" >
               <p className="gameresult-title">Results</p>
               <img style={{ height: '200px' }} src={win} />

               <div className="relative gameresult-users" >

                  <img
                     className="gameresult-crown"
                     style={props.gameResult.wonBy === user.id ? { left: '13px' } : { right: '13px' }}
                     src={crown}
                  />
                  <div className="flex-column-center">
                     <div className="gameresult-users-pp">
                        <ProfilePicture image={user.url} />
                     </div>
                     <p className="gameresult-users-username">{props.gameResult.player1Id === user.id ? user.username : player.username}</p>
                  </div>

                  <div className="flex-center">
                     <p className="gameresult-score">{props.gameResult.player1Id === user.id ? props.gameResult.player1Score : props.gameResult.player2Score}</p>
                     <p style={{ padding: '0px 10px 0px 10px' }}>-</p>
                     <p className="gameresult-score">{props.gameResult.player1Id === player.id ? props.gameResult.player1Score : props.gameResult.player2Score}</p>
                  </div>

                  <div className="flex-column-center">
                     <div className="gameresult-users-pp">
                        <ProfilePicture image={player.url} />
                     </div>
                     <p className="gameresult-users-username">{props.gameResult.player2Id === user.id ? user.username : player.username}</p>
                  </div>

               </div>

               <button className="play-button" onClick={props.playAgain}>
                  Play again
               </button>
            </div>
         }
      </div>
   )
}