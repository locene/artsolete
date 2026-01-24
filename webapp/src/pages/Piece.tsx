import './Piece.scss';
import { Application } from 'pixi.js';
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { pieces } from '../data/pieces';

function Piece() {
    const { id } = useParams();
    const piece = pieces.find(piece => String(piece.id).padStart(3, '0') === id)!;

    useEffect(() => {
        document.title = `${id}. ${piece.name}`;
    }, [id, piece.name]);

    const statusRef = useRef<'unmounted' | 'initializing' | 'ready'>('unmounted');

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const appRef = useRef<Application | null>(null);

    useEffect(() => {
        if (statusRef.current != 'unmounted' || appRef.current) return;

        (async () => {
            statusRef.current = 'initializing';

            try {
                const { sketch } = await import(`../sketches/${id}.tsx`);
                appRef.current = await sketch(canvasRef.current as HTMLCanvasElement);

                const message = { type: 'PIECE_SUCCESS' };
                window.parent.postMessage(message, import.meta.env.VITE_POST_MESSAGE_TARGET_ORIGIN);
            }
            catch (error) {
                const message = { type: 'PIECE_ERROR', data: error };
                window.parent.postMessage(message, import.meta.env.VITE_POST_MESSAGE_TARGET_ORIGIN);
            }

            statusRef.current = 'ready';
        })();

        return () => {
            if (statusRef.current === 'ready') {
                appRef.current?.destroy(true, true);
                appRef.current = null;

                statusRef.current = 'unmounted';
            };
        };
    }, [id]);

    return (
        <div id="piece">
            <canvas ref={canvasRef} />
        </div>
    );
};

export default Piece;
