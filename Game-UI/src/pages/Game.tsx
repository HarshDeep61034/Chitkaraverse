import {useRef, useState } from "react";
import { PhaserGame } from "../components/PhaserGame";
import { socket } from "../lib/socket";
import { useNavigate } from "react-router-dom";

const Game = () => {
    const navigate = useNavigate();
    const phaserRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(false);
    
    function currentScene() {
        // Scene handling logic here
    }
    
    const toggleFullscreen = () => {
        const gameContainer = document.getElementById('game-container');
        if (!document.fullscreenElement) {
            if (gameContainer?.requestFullscreen) {
                gameContainer.requestFullscreen().catch(err => {
                    console.error(`Error attempting to enable fullscreen: ${err.message}`);
                });
                setIsFullscreen(true);
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };
    
    const toggleControls = () => {
        setShowControls(!showControls);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
            {/* Header */}
            <header className="bg-gray-800 bg-opacity-70 backdrop-blur-sm shadow-md p-4 flex justify-between items-center">
                <div className="flex items-center">
                    <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                        Chitkara Verse
                    </h1>
                </div>
                <div className="flex space-x-3">
                    <button 
                        onClick={toggleControls}
                        className="px-3 py-1.5 rounded bg-gray-700 hover:bg-gray-600 transition text-sm flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                        Controls
                    </button>
                    <button 
                        onClick={() => navigate("/")}
                        className="px-3 py-1.5 rounded bg-purple-700 hover:bg-purple-600 transition text-sm"
                    >
                        Exit Game
                    </button>
                </div>
            </header>

            {/* Game container */}
            <div className="flex flex-col items-center justify-center p-4">
                {socket.connected ? (
                    <div className="relative w-full max-w-4xl">
                        {/* Game */}
                        <div className="relative bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
                            <div className="game-wrapper w-full h-full">
                                <PhaserGame
                                    ref={phaserRef}
                                    currentActiveScene={currentScene}
                                />
                            </div>
                            
                            {/* Fullscreen button */}
                            <button 
                                onClick={toggleFullscreen}
                                className="absolute top-4 right-4 bg-gray-800 bg-opacity-50 hover:bg-opacity-70 p-2 rounded-full transition"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {isFullscreen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5" />
                                    )}
                                </svg>
                            </button>
                        </div>
                        
                        {/* Controls panel (conditionally rendered) */}
                        {showControls && (
                            <div className="mt-4 p-4 bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-lg shadow-lg">
                                <h3 className="text-lg font-semibold mb-2">Game Controls</h3>
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                    <div className="bg-gray-700 p-3 rounded text-center">
                                        <kbd className="px-2 py-1 bg-gray-900 rounded text-xs">W</kbd>
                                        <p className="text-xs mt-1">Move Up</p>
                                    </div>
                                    <div className="bg-gray-700 p-3 rounded text-center">
                                        <kbd className="px-2 py-1 bg-gray-900 rounded text-xs">A</kbd>
                                        <p className="text-xs mt-1">Move Left</p>
                                    </div>
                                    <div className="bg-gray-700 p-3 rounded text-center">
                                        <kbd className="px-2 py-1 bg-gray-900 rounded text-xs">S</kbd>
                                        <p className="text-xs mt-1">Move Down</p>
                                    </div>
                                    <div className="bg-gray-700 p-3 rounded text-center">
                                        <kbd className="px-2 py-1 bg-gray-900 rounded text-xs">D</kbd>
                                        <p className="text-xs mt-1">Move Right</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 p-6 bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-lg shadow-lg">
                        <div className="text-red-400 text-xl mb-4 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Socket not connected!
                        </div>
                        <p className="text-gray-300 mb-6">Unable to establish connection to the game server.</p>
                        <button 
                            onClick={() => navigate("/")}
                            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-500 hover:to-purple-500 transition shadow-lg"
                        >
                            Return to Home
                        </button>
                    </div>
                )}
            </div>
            
            {/* Mobile controls (visible only on touch devices) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 flex justify-center">
                <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-4 grid grid-cols-3 gap-3">
                    <div className="col-start-2">
                        <button className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                        </button>
                    </div>
                    <div>
                        <button className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    </div>
                    <div className="col-start-2">
                        <button className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>
                    <div>
                        <button className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Game;