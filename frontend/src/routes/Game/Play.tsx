import React, { useState } from "react";
import './Game.css'


function Customization(props: any) {

   const [custom, setCustom] = useState("");

   return (
      <div
         style={{ marginTop: '20px' }}
      >
         <p className="reset play-page-title">Customization</p>
         <div
            className="flex"
            style={{ marginTop: '10px', gap: '10px' }}
         >
            <button
               className="button white"
               style={custom === "space" ? { backgroundColor: 'gray', color: 'white' } : {}}
               onClick={() => {
                  if (custom && custom === "space") {
                     setCustom("");
                     props.setCustomization("")
                  }
                  else {
                     setCustom("space");
                     props.setCustomization("space")
                  }
               }}
            >
               space
            </button>
            <button
               className="button white"
               style={custom === "focus" ? { backgroundColor: 'gray', color: 'white' } : {}}
               onClick={() => {
                  if (custom && custom === "focus") {
                     setCustom("");
                     props.setCustomization("")
                  }
                  else {
                     setCustom("focus");
                     props.setCustomization("focus")
                  }
               }}            >
               focus
            </button>

         </div>
      </div>
   )
}


type TPlay = {
   children: any
   searchGame: (s: string) => void,
   customization: string,
   setCustomization: (s: string) => void
}

export default function Play(props: TPlay) {

   const [showMode, setShowMode] = useState(false);

   return (
      <div className="play-page">
         {
            showMode ?
               <div
                  className="flex-column white label"
                  style={{ width: '200px', padding: '20px' }}
               >
                  <div className="">
                     <p className="reset play-page-title">Game mode</p>
                     <div
                        className="flex-column"
                        style={{ marginTop: '10px', gap: '5px' }}
                     >
                        <button
                           onClick={() => { props.searchGame("CLASSIC") }}
                           className="play-button"
                        >
                           Classic
                        </button>
                        <button
                           onClick={() => { props.searchGame("SPEEDUP"); props.setCustomization("speed") }}
                           className="play-button"
                        >
                           Speed up
                        </button>
                        <button
                           onClick={() => { props.searchGame("HARDMODE") }}
                           className="play-button"
                        >
                           Hardcore
                        </button>
                     </div>
                  </div>

                  <Customization {...props} />

               </div>
               :
               <button onClick={() => setShowMode(true)} className="play-button">
                  Play
               </button>
         }

      </div>
   );
}