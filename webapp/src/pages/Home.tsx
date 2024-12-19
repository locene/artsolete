import './Home.scss';
import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { HugeiconsGithub } from '../icons/HugeiconsGithub';

function Home() {
    useEffect(() => {
        document.title = 'Artsolete';
    }, []);

    return (
        <div id="home">
            <div className="title">ARTSOLETE</div>
            <div className="entrance">
                <NavLink to="/001">&lt;&nbsp;Entrance&nbsp;&gt;</NavLink>
            </div>
            <div className="links">
                <a href="https://github.com/locene/artsolete" target="_blank"><HugeiconsGithub /></a>
            </div>
        </div>
    );
};

export default Home;
