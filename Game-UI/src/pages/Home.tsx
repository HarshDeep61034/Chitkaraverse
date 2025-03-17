import { useNavigate } from "react-router-dom";
import { socket } from "../lib/socket";
import { useContext, useState } from "react";
import { userContext } from "../providers/contextProvider";

const Home = () => {
    const navigate = useNavigate();
    const [user, _setUser] = useContext(userContext);
    const [isJoining, setIsJoining] = useState(false);
    
    async function handleJoin() {
        setIsJoining(true);
        setTimeout(() => {
            navigate("/game");
        }, 500);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">
                        Chitkara Verse
                    </h1>
                    <p className="text-blue-200">Enter the virtual universe</p>
                </div>
                
                {/* User Card */}
                <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl shadow-lg p-6 mb-8 border border-gray-700 hover:border-purple-500 transition-all">
                    <div className="flex items-center mb-4">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-2xl font-bold text-white">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                            <h2 className="text-xl font-semibold text-white">{user.name}</h2>
                            <p className="text-gray-300 text-sm">Player ID: <span className="text-blue-300">{user.id}</span></p>
                        </div>
                    </div>
                    
                    <div className="bg-gray-900 bg-opacity-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-400 text-sm">Status</span>
                            <span className="text-green-400 text-sm flex items-center">
                                <span className="h-2 w-2 rounded-full bg-green-400 inline-block mr-2"></span>
                                Online
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Game Session</span>
                            <span className="text-yellow-400 text-sm">Ready to join</span>
                        </div>
                    </div>
                </div>
                
                {/* Buttons */}
                <div className="space-y-4">
                    <button 
                        onClick={() => handleJoin()}
                        disabled={isJoining}
                        className={`w-full py-4 rounded-xl font-bold text-white transition-all 
                        ${isJoining 
                            ? 'bg-gray-700 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg hover:shadow-purple-500/20'
                        }`}
                    >
                        {isJoining ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Joining...
                            </span>
                        ) : (
                            'Join Game'
                        )}
                    </button>
                    
                    <button 
                        onClick={() => socket.disconnect()}
                        className="w-full py-3 bg-transparent border border-gray-600 hover:border-red-500 hover:text-red-400 text-gray-300 rounded-xl transition-all font-medium"
                    >
                        Leave Universe
                    </button>
                </div>
                
                {/* Footer */}
                <div className="mt-12 text-center text-gray-400 text-xs">
                    <p>Chitkara Verse &copy; 2025 | All Rights Reserved</p>
                </div>
            </div>
        </div>
    );
};

export default Home;