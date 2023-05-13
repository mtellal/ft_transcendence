import React from "react";

import '../styles/Profile.css'
 
import '../styles/History.css'

function MatchHistory(props)
{

    const winStyle = {
        backgroundColor: '#DCFFD4',
        border: "1px solid green"
    }

    const loseStyle = {
        backgroundColor: '#FFD4D4',
        border: "1px solid red"
    }

    function scoreStyle()
    {
        if (props.score1 === props.score2)
            return ;
        if (props.score1 > props.score2)
            return (winStyle)
        else
            return (loseStyle)
    }

    return (
        <div 
            className="match-div"
            style={scoreStyle()}
        >
            <h3 className="player-name" >{props.player1}</h3>
            <h1 className="score" >
                {props.score1} -  {props.score2}
            </h1>
            <h3 className="player-name" >{props.player2}</h3>
        </div>
    )
}

function generateScore(max)
{
    return (Math.floor(Math.random() * max))
}

export default function History(props)
{

    const exampleScores = [
        {
            id: 0,
            player1: "faker",
            score1: generateScore(20),
            score2: generateScore(20),
            player2: "federer",
        },
        {
            id: 1,
            player1: "joueur1",
            score1: generateScore(20),
            score2: generateScore(20),
            player2: "joueur2",
        },
        {
            id: 2,
            player1: "joueur1",
            score1: generateScore(20),
            score2: generateScore(20),
            player2: "joueur2",
        },
        {
            id: 3,
            player1: "joueur1",
            score1: generateScore(20),
            score2: generateScore(20),
            player2: "joueur2",
        },
        {
            id: 4,
            player1: "joueur1",
            score1: generateScore(20),
            score2: generateScore(20),
            player2: "joueur2",
        },
        {
            id: 5,
            player1: "joueur1",
            score1: generateScore(20),
            score2: generateScore(20),
            player2: "joueur2",
        },
        {
            id: 6,
            player1: "joueur1",
            score1: generateScore(20),
            score2: generateScore(20),
            player2: "joueur2",
        },
        {
            id: 7,
            player1: "joueur1",
            score1: generateScore(20),
            score2: generateScore(20),
            player2: "joueur2",
        },
        {
            id: 8,
            player1: "joueur1",
            score1: 10,
            score2: 10,
            player2: "joueur2",
        }
    ]

    const listHistory = exampleScores.map(e => {
        return (
            <MatchHistory
                key={e.id}
                id={e.id}
                player1={e.player1}
                score1={e.score1}
                score2={e.score2}
                player2={e.player2}
            />
        )
    }) 


    return (
        <div className="flex-column history">
            <h1>History</h1>
            {listHistory.length === 0 && <p>No match found</p>}
            {listHistory}
        </div>
    )
}