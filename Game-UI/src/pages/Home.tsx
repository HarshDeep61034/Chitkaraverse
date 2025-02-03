import { useNavigate } from "react-router-dom";
import { socket } from "../lib/socket";
import { useContext} from "react";
import { userContext } from "../providers/contextProvider";

const Home = () => {
    const navigate = useNavigate();
    const [user, _setUser] = useContext(userContext);
    async function handleJoin() {
        
        navigate("/game");
    }

    return (
        <div>
            <div>
                <h1>Name: {user.name}</h1>
                <h1>Id: {user.id}</h1>
                <h1>Home Page</h1>
            </div>
            <button onClick={() => handleJoin()}>Join Game</button>
            <button onClick={() => socket.disconnect()}>Elminiate</button>
        </div>
    );
};

export default Home;

