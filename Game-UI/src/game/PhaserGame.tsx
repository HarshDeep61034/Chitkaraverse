import {
    forwardRef,
    useContext,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import StartGame from "./main";
import { EventBus } from "./EventBus";
import { socket } from "../lib/socket";
import { userContext } from "../providers/contextProvider";

export interface IRefPhaserGame {
    game: Phaser.Game | null;
    scene: Phaser.Scene | null;
}

interface IProps {
    currentActiveScene?: (scene_instance: Phaser.Scene) => void;
}

export const PhaserGame = forwardRef<IRefPhaserGame, IProps>(
    function PhaserGame({ currentActiveScene }, ref) {
        const [playerCoordinates, setPlayerCoordinates] = useState({
            x: 200,
            y: 128,
        });
        const GLOBALROOMID = "1234";
        const [user, _setUser] = useContext(userContext);

        const game = useRef<Phaser.Game | null>(null!);

        useEffect(() => {
            // EMITING TO SERVER
            socket.emit("join", {
                roomId: GLOBALROOMID,
                user,
                playerCoordinates,
            });

            // Set up socket listeners BEFORE emitting events
            socket.on('players-context', (data) => {
                console.log("Rendering already joined players:", data);
               setTimeout(()=>{
                   EventBus.emit("prejoined-players-context", data);
               }, 2000);
            });

            socket.on("join", (data) => {
                console.log("Player joined:", data);
                const lol = EventBus.emit("player-joined", data);
                console.log(lol);
            });

            socket.on("player-stopped", (data)=>{
                EventBus.emit('player-stopped-server', (data));
            })

            socket.on("message", (data) => {
                console.log(data);
            });

            socket.on("player-moved", (data) => {
                EventBus.emit("player-moved-server", data);
            });

            // Emit current-scene-ready event at the end to ensure listeners are set up
            EventBus.emit('current-scene-ready');

            // Cleanup socket listeners on unmount
            return () => {
                socket.off("join");
                socket.off("players-context");
                socket.off("player-moved");
                socket.off("message");
            };
        }, []);

        useLayoutEffect(() => {
            if (game.current === null) {
                game.current = StartGame("game-container");

                if (typeof ref === "function") {
                    ref({ game: game.current, scene: null });
                } else if (ref) {
                    ref.current = { game: game.current, scene: null };
                }
            }

            return () => {
                if (game.current) {
                    game.current.destroy(true);
                    if (game.current !== null) {
                        game.current = null;
                    }
                }
            };
        }, [ref]);

        useEffect(() => {
            EventBus.on(
                "player-moved-client",
                (coordinates: { x: number; y: number }) => {
                    setPlayerCoordinates({
                        x: coordinates.x,
                        y: coordinates.y,
                    });
                    socket.emit("player-moved", {
                        roomId: GLOBALROOMID,
                        user,
                        playerCoordinates: coordinates,
                    });
                }
            );

            EventBus.on('player-stopped', (coordinates: { x: number; y: number })=>{

                setPlayerCoordinates({
                    x: coordinates.x,
                    y: playerCoordinates.y,
                })

                socket.emit("player-stopped", {
                    roomId: GLOBALROOMID,
                    user,
                    playerCoordinates: coordinates,
                })

            })

            EventBus.on(
                "current-scene-ready",
                (scene_instance: Phaser.Scene) => {
                    if (
                        currentActiveScene &&
                        typeof currentActiveScene === "function"
                    ) {
                        currentActiveScene(scene_instance);
                    }

                    if (typeof ref === "function") {
                        ref({ game: game.current, scene: scene_instance });
                    } else if (ref) {
                        ref.current = {
                            game: game.current,
                            scene: scene_instance,
                        };
                    }
                }
            );
            
            return () => {
                EventBus.removeListener("current-scene-ready");
                EventBus.removeListener("player-moved-client");
            };
        }, [currentActiveScene, ref]);

        return <div id="game-container"></div>;
    }
);