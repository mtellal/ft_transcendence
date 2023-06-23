import React, { useState } from "react";
import './Game.css'

type TSelectButton = {
  onClick: () => void,
  label: string
}

function SelectButton(props: TSelectButton) {
  const [selected, setSelected] = useState(false);
  return (
    <button
      className="button"
      style={selected ? { backgroundColor: 'gray', color: 'white' } : {}}
      onClick={() => { props.onClick(); setSelected((p: boolean) => !p) }}
    >
      {props.label}
    </button>
  )
}

type TPlay = {
  searchGame: (s: string) => void,
  setCustomization: (s: string) => void
}

export default function Play(props: TPlay) {

  const [showMode, setShowMode] = useState(false);

  return (
    <div className="play-page">
      {
        showMode ?
          <div
            className="flex-column-center white label"
            style={{ height: '300px', width: '200px' }}
          >
            <div className="">
              <h2>Game mode</h2>
              <div className="">
                <button onClick={() => { props.searchGame("CLASSIC") }} className="play-button">
                  Classic
                </button>
                <button onClick={() => { props.searchGame("SPEEDUP"); props.setCustomization("sanic") }} className="play-button">
                  Speed up
                </button>
                <button onClick={() => { props.searchGame("HARDMODE") }} className="play-button">
                  Hardcore
                </button>
              </div>
            </div>

            <div className="">
              <h2>Customization</h2>
              <div className="">
                <SelectButton
                  label="Mario"
                  onClick={() => { props.setCustomization("mario") }}
                />
              </div>
            </div>

          </div>
          :
          <button onClick={() => setShowMode(true)} className="play-button">
            Play
          </button>
      }

    </div>
  );
}