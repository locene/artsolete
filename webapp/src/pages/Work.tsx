import './Work.scss';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { works } from '../data';
import useMountWork from '../hooks/useMountWork';

function Frame() {
    const { id } = useParams();
    const work = works.find(work => String(work.id).padStart(3, '0') === id)!;

    useEffect(() => {
        document.title = `${id}. ${work.name}`;
    }, [id, work.name]);

    useEffect(() => {
        const handleError = (event: any) => {
            const message = { type: 'FROM_WORK', data: event.message };
            window.parent.postMessage(message, import.meta.env.VITE_POST_MESSAGE_TARGET_ORIGIN);
        };

        window.addEventListener('error', handleError);

        return () => {
            window.removeEventListener('error', handleError);
        };
    }, []);

    useEffect(() => {
        (async () => {
            const canvas = document.querySelector('canvas[alt^=artsolete_]');
            if (canvas) {
                canvas.remove();
            }

            const { default: init, main } = await import(`../../../canvas/_${id}/pkg/_${id}.js`);
            await init();
            main();
        })();
    }, [id]);

    return (
        <>
            {useMountWork()}
        </>
    );
};

export default Frame;
