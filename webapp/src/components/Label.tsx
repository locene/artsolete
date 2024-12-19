import './Label.scss';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { works } from '../data';

function Label() {
    const { id } = useParams();
    const work = works.find(work => String(work.id).padStart(3, '0') === id)!;

    const [isOpen, setIsOpen] = useState(false);
    const maskRef = useRef<HTMLDivElement | null>(null);

    const toggleLabel = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (maskRef.current && maskRef.current.contains(event.target)) {
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

    return (
        <div id="label" className={isOpen ? 'opened' : ''}>
            <div className="caption">
                <div className="title" onClick={toggleLabel}>
                    <span className="no">{id}</span>
                    <span className="name">{work.name}</span>
                </div>

            </div>
            <div className="description">
                <div className="info">
                    <div dangerouslySetInnerHTML={{ __html: work.label }}></div>
                </div>
                <div className="more">
                    <span className="date">{work.date}</span>
                    <span>&nbsp;</span>
                </div>
            </div>
            <div className="mask" ref={maskRef}></div>
        </div>
    );
};

export default Label;
