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
        const load = async () => {
            const canvas = document.querySelector('canvas[alt^=artsolete_]');
            if (canvas) {
                canvas.remove();
            }

            const { default: init, main } = await import(`../../../canvas/_${id}/pkg/_${id}.js`);
            await init();
            main();
        };

        load();
    }, [id]);

    return (
        <>
            {useMountWork()}
        </>
    );
};

export default Frame;
