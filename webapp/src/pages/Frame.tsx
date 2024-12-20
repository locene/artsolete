import './Frame.scss';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Label from '../components/Label';
import Sidebar from '../components/Sidebar';
import { works } from '../data';
import { HugeiconsGithub } from '../icons/HugeiconsGithub';
import { SvgSpinnersBarsScaleFade } from '../icons/SvgSpinnersBarsScaleFade';

function Frame() {
    const { id } = useParams();
    const work = works.find(work => String(work.id).padStart(3, '0') === id)!;

    useEffect(() => {
        document.title = `${id}. ${work.name}`;
    }, [id, work.name]);

    return (
        <div id="frame">
            <Sidebar />
            <iframe src={`/${id}/work`} sandbox="allow-scripts"></iframe>
            <div className="loading"><SvgSpinnersBarsScaleFade /></div>
            <Label />
            <div className="links">
                <a href={`https://github.com/locene/artsolete/tree/main/canvas/_${id}`} target="_blank"><HugeiconsGithub /></a>
            </div>
        </div>
    );
};

export default Frame;
