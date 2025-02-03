import { useRef } from "react";
import { IRefPhaserGame, PhaserGame } from "./game/PhaserGame";
// import { Game } from './game/scenes/Game';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Random from "./pages/random";
import ContextProvider from "./providers/contextProvider";

function App() {
    // The sprite can only be moved in the MainMenu Scene
    // const [canMoveSprite, setCanMoveSprite] = useState(true);

    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    // const changeScene = () => {

    //     if(phaserRef.current)
    //     {
    //         const scene = phaserRef.current.scene as Game;

    //         if (scene)
    //         {
    //             scene.changeScene();
    //         }
    //     }
    // }

    // const moveSprite = () => {

    //     if(phaserRef.current)
    //     {

    //         const scene = phaserRef.current.scene as Game;

    //         if (scene && scene.scene.key === 'MainMenu')
    //         {
    //             // Get the update logo position
    //             scene.moveLogo(({ x, y }) => {

    //                 setSpritePosition({ x, y });

    //             });
    //         }
    //     }

    // }

    // const addSprite = () => {

    //     if (phaserRef.current)
    //     {
    //         const scene = phaserRef.current.scene;

    //         if (scene)
    //         {
    //             // Add more stars
    //             const x = Phaser.Math.Between(64, scene.scale.width - 64);
    //             const y = Phaser.Math.Between(64, scene.scale.height - 64);

    //             //  `add.sprite` is a Phaser GameObjectFactory method and it returns a Sprite Game Object instance
    //             const star = scene.add.sprite(x, y, 'star');

    //             //  ... which you can then act upon. Here we create a Phaser Tween to fade the star sprite in and out.
    //             //  You could, of course, do this from within the Phaser Scene code, but this is just an example
    //             //  showing that Phaser objects and systems can be acted upon from outside of Phaser itself.
    //             scene.add.tween({
    //                 targets: star,
    //                 duration: 500 + Math.random() * 1000,
    //                 alpha: 0,
    //                 yoyo: true,
    //                 repeat: -1
    //             });
    //         }
    //     }
    // }

    // Event emitted from the PhaserGame component
    // const currentScene = (scene: Phaser.Scene) => {
    //     // setCanMoveSprite(scene.scene.key !== 'MainMenu');
    // };

    return (
        <BrowserRouter>
            <ContextProvider>
                <Routes>
                    <Route path="/" Component={Home} />
                    <Route path="/game" Component={Game} />
                    <Route path="/random" Component={Random} />
                    {/* <Route path="*" element={<NoPage />} /> */}
                </Routes>
            </ContextProvider>
        </BrowserRouter>
    );
}

export default App;

