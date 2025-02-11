import { useContext, useEffect, useRef } from "react";
import { PhaserGame } from "../game/PhaserGame";
import { socket } from "../lib/socket";
import { useNavigate } from "react-router-dom";

const Game = () => {
    const navigate = useNavigate();
    const phaserRef = useRef(null);

    function currentScene(){}

    return (
        <div id="app w-screen h-screen flex justify-center items-center">
            <div className="game-wrapper">
                {socket.connected ? (
                    <PhaserGame
                        ref={phaserRef}
                        currentActiveScene={currentScene}
                    />
                ) : (
                    <h1 style={{textAlign: "center"}} className="">
                        Socket not connected!!
                        <br />
                        <button onClick={()=>navigate("/")}>Home</button>
                    </h1>
                )}
            </div>
        </div>
    );
};

export default Game;

