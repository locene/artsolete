import './Frame.scss';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Label from '../components/Label';
import Sidebar from '../components/Sidebar';
import { works } from '../data';
import { HugeiconsGithub } from '../icons/HugeiconsGithub';
import { SvgSpinnersBarsScaleFade } from '../icons/SvgSpinnersBarsScaleFade';

function Frame() {
    const { id } = useParams();
    const work = works.find(work => String(work.id).padStart(3, '0') === id)!;

    const [compatible, setCompatible] = useState(true);

    useEffect(() => {
        setCompatible(true);
    }, [id]);

    useEffect(() => {
        document.title = `${id}. ${work.name}`;
    }, [id, work.name]);

    useEffect(() => {
        const handleMessage = (event: any) => {
            if (event.origin !== import.meta.env.VITE_POST_MESSAGE_TARGET_ORIGIN) {
                return;
            }

            const { type, data } = event.data;
            if (type === 'FROM_WORK') {
                if (data.startsWith('Uncaught RuntimeError: unreachable')) {
                    setCompatible(false);
                }
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
            <div className="incompatible" style={{ display: compatible ? 'none' : 'flex' }}>
                <div>
                    <p>Unable to render correctly.</p>
                    <p>Please upgrade your browser or try a different device.</p>
                </div>
            </div>
            <iframe src={`/${id}/work`} sandbox="allow-scripts allow-same-origin"></iframe>
            <div className="loading" style={{ display: compatible ? 'flex' : 'none' }}><SvgSpinnersBarsScaleFade /></div>
            <Label />
            <div className="links">
                <a href={`https://github.com/locene/artsolete/tree/main/canvas/_${id}`} target="_blank"><HugeiconsGithub /></a>
            </div>
        </div>
    );
};

export default Frame;
