import React, { useState, useEffect, useCallback } from "react";

import './Game.css'


type TGame = {
    gameRoom: any,
    socket: any,
    customization: string,
    spaceImage: any,
    speedImage: any,
    focusImage: any,
    ballColor: string,
    playerColor: string
    scoreColor: string
}

export default function Game(props: TGame) {
    const canvasRef: any = React.useRef();

    const [socket, setSocket] = useState(null);
    const [gameRoom, setGameRoom] = useState(null);

    const [context, setContext]: any = useState();

    const [scoreP1, setScoreP1] = useState(0);
    const [scoreP2, setScoreP2] = useState(0);

    const [ratioHeight, setRatioHeight] = useState(1);
    const [ratioWidth, setRatioWidth] = useState(1);


    function initContext() {
        const context = canvasRef.current.getContext('2d');
        setContext(context);
        setRatioWidth(canvasRef.current.clientWidth / 1600);
        setRatioHeight(canvasRef.current.clientHeight / 800);
        canvasRef.current.width = canvasRef.current.clientWidth;
        canvasRef.current.height = canvasRef.current.clientHeight;
    }

    function drawBall(context: any, x: number, y: number, radius: number) {
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fillStyle = props.ballColor || 'black';
        context.fill();
    }

    function drawPlayers(context: any, player1: any, player2: any, ratioHeight: number, ratioWidth: number) {
        context.beginPath();
        context.fillStyle = props.playerColor || 'black';
        context.fillRect(player1.x * ratioWidth, player1.y * ratioHeight, player1.width * ratioWidth, player1.height * ratioHeight);
        context.fillRect(player2.x * ratioWidth, player2.y * ratioHeight, player2.width * ratioWidth, player2.height * ratioHeight);
    }

    const drawField = useCallback((context: any, width: number, height: number) => {
        if (props.customization) {
            if (props.customization === "space")
                context.drawImage(props.spaceImage, 0, 0, width, height);
            else if (props.customization === "speed")
                context.drawImage(props.speedImage, 0, 0, width, height);
            else if (props.customization === "focus")
                context.drawImage(props.focusImage, 0, 0, width, height);
        }
        else {
            context.beginPath();
            context.arc(width / 2, height / 2, 50, 0, Math.PI * 2);
            context.fillStyle = '#FFD8B8';
            context.fill();
            context.stroke();
            context.fillStyle = 'black';
            context.fillRect(width / 2, 0, 1, height);
        }
    }, [props.customization, props.spaceImage, props.speedImage, props.focusImage]);

    const drawGameState = useCallback((gameState: any) => {
        if (context && canvasRef && canvasRef.current && ratioHeight && ratioWidth) {
            context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

            drawField(context, canvasRef.current.width, canvasRef.current.height)

            drawPlayers(context, gameState.player1, gameState.player2, ratioHeight, ratioWidth)
            drawBall(context, gameState.ball.x * ratioWidth, gameState.ball.y * ratioHeight, gameState.ball.radius * ratioWidth);


            setScoreP1((p: number) => p !== gameState.score.player1Score ? gameState.score.player1Score : p);
            setScoreP2((p: number) => p !== gameState.score.player2Score ? gameState.score.player2Score : p);

        }
    }, [
        context,
        canvasRef,
        ratioHeight,
        ratioWidth,
        drawField
    ]
    );


    /* //////////   MOVEMENTS FUNCTIONS     //////////*/

    const handleKeyDown = (e: any) => {
        if (e.key === "w") {
            moveUp();
        } else if (e.key === "s") {
            moveDown();
        }
    };

    const handleKeyUp = (e: any) => {
        if (e.key === "w" || e.key === "s") {
            stopMovement();
        }
    };

    const moveUp = useCallback(() => {
        if (socket) {
            socket.emit("moveUp", gameRoom?.id);
        }
    }, [socket, gameRoom]);

    const moveDown = useCallback(() => {
        if (socket)
            socket.emit("moveDown", gameRoom?.id);
    }, [socket, gameRoom]);

    const stopMovement = useCallback(() => {
        if (socket)
            socket.emit("stopMove", gameRoom?.id);
    }, [socket, gameRoom]);


    useEffect(() => {
        initContext();
    }, [])

    useEffect(() => {
        if (canvasRef && canvasRef.current) {
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
    }, [props.socket, context, ratioHeight, ratioWidth, drawGameState]);




    return (
        <div className="game relative">
            <canvas
                ref={canvasRef}
                className="game--canvas"
                onKeyUp={handleKeyUp}
                onKeyDown={handleKeyDown}
                tabIndex={0}
            />
            <div
                className="absolute game-score"
                style={{ color: props.scoreColor, left: '30px' }}
            >
                <p>{scoreP1}</p>
            </div>
            <div
                className="absolute game-score"
                style={{ color: props.scoreColor, right: '30px' }}
            >
                <p>{scoreP2}</p>
            </div>
        </div>
    )
}
