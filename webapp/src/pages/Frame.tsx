import './Frame.scss';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Label from '../components/Label';
import Sidebar from '../components/Sidebar';
import { pieces } from '../data/pieces';
import { HugeiconsGithub } from '../icons/HugeiconsGithub';
import { SvgSpinnersBarsScaleFade } from '../icons/SvgSpinnersBarsScaleFade';

function Frame() {
    const { id } = useParams();
    const piece = pieces.find(piece => String(piece.id).padStart(3, '0') === id)!;

    useEffect(() => {
        document.title = `${id}. ${piece.name}`;
    }, [id, piece.name]);

    const [pieceStatus, setPieceStatus] = useState<'success' | 'error' | null>(null);

    useEffect(() => {
        setTimeout(() => {
            setPieceStatus(null);
        }, 0);
    }, [id]);

    useEffect(() => {
        const handleMessage = (event: { origin: string, data: { type: string, data: ErrorEvent } }) => {
            if (event.origin !== import.meta.env.VITE_POST_MESSAGE_TARGET_ORIGIN) {
                return;
            }

            const { type, data } = event.data;

            if (type === 'PIECE_SUCCESS') {
                setPieceStatus('success');
            }

            if (type === 'PIECE_ERROR') {
                console.error(data);
                setPieceStatus('error');
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    return (
        <div id="frame">
            <Sidebar />

            <div className="error" style={{ display: pieceStatus === 'error' ? 'flex' : 'none' }}>
                <div>
                    <p>Unable to render correctly.</p>
                </div>
            </div>

            <iframe style={{ display: pieceStatus ? 'flex' : 'none' }} src={`/${id}/piece`} sandbox="allow-scripts allow-same-origin" key={id}></iframe>

            <div className="loading" style={{ display: pieceStatus ? 'none' : 'flex' }}><SvgSpinnersBarsScaleFade /></div>

            <Label />

            <div className="links">
                <a href={`https://github.com/locene/artsolete/tree/main/webapp/src/sketches/${id}.tsx`} target="_blank"><HugeiconsGithub /></a>
            </div>
        </div>
    );
};

export default Frame;
