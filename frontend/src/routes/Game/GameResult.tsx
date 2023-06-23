import React, { useState, useEffect, useCallback } from "react";

import { useCurrentUser } from "../../hooks/Hooks";
import useFetchUsers from "../../hooks/useFetchUsers";
import ProfilePicture from "../../components/users/ProfilePicture";
import ResizeContainer from "../../components/ResizeContainer";

import './Game.css'

type TGameResult = {
  gameResult: any, 
  playAgain: () => void
}

export default function GameResult(props: TGameResult) {

    const [player, setPlayer]: any = useState();
  
    const { user } = useCurrentUser();
    const { fetchUser } = useFetchUsers();
  
  
    const loadPlayers = useCallback(async (gameResult: any) => {
      let oplayer;
      if (gameResult.player1Id === user.id)
        oplayer = await fetchUser(gameResult.player2Id);
      else
        oplayer = await fetchUser(gameResult.player1Id);
      setPlayer(oplayer);
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
          <div className="flex-column-center reset label white" style={{ padding: '20px', minWidth: '200px' }}>
            <h2>Winner</h2>
            <ResizeContainer height="50px" width="50px">
              <ProfilePicture
                image={props.gameResult.wonBy === user.id ? user.url : player.url}
              />
            </ResizeContainer>
            <p>{props.gameResult.wonBy === user.id ? user.username : player.username}</p>
            <p>{`${props.gameResult.player1Score} - ${props.gameResult.player2Score}`}</p>
            <button className="play-button" onClick={props.playAgain}>
              Play again
            </button>
          </div>
        }
      </div>
    )
  }