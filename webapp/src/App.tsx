import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Frame from './pages/Frame';
import Home from './pages/Home';
import Piece from './pages/Piece';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/:id" element={<Frame />} />
                <Route path="/:id/piece" element={<Piece />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
