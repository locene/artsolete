import './Sidebar.scss';
import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { pieces } from '../data/pieces';

function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const maskRef = useRef<HTMLDivElement | null>(null);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const closeSidebar = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (maskRef.current && maskRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const navigate = useNavigate();

    return (
        <div id="sidebar" className={isOpen ? 'opened' : ''}>
            <div className="back">
                <div
                    className="back-text"
                    onClick={() => {
                        navigate('/');
                        closeSidebar();
                    }}
                >
                    &lt;
                </div>
            </div>
            <ul className="pieces">
                {pieces.map(piece => (
                    <li key={piece.id}>
                        <NavLink
                            to={'/' + String(piece.id).padStart(3, '0')}
                            className={({ isActive }) => (isActive ? 'active' : '')}
                            onClick={closeSidebar}
                        >
                            <span>{String(piece.id).padStart(3, '0')}</span>
                            {piece.name}
                        </NavLink>
                    </li>
                ))}
            </ul>
            <div className="list">
                <div className="list-text" onClick={toggleSidebar}>A</div>
            </div>
            <div className="mask" ref={maskRef}></div>
        </div>
    );
};

export default Sidebar;
