import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Frame from './pages/Frame';
import Home from './pages/Home';
import Work from './pages/Work';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/:id" element={<Frame />} />
                <Route path="/:id/work" element={<Work />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
