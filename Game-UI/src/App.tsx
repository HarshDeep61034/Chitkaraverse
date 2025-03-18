import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Random from "./pages/random";
import ContextProvider from "./providers/contextProvider";

function App() {

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

