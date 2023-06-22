import React, { useState, useEffect } from "react";

import './Game.css'


export default function SearchGame(props: any) {

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
      <div className="play-page" style={{ minHeight: '200px' }}>
        <div className="flex-column-center">
          <button className="play-button" style={{ cursor: 'none' }}>
            Searching a game {points}
          </button>
          <button
            className="play-button"
            onClick={props.cancelSearchGame}
            style={{ marginTop: '20px' }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }
  