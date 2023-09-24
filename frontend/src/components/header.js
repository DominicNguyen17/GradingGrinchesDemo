import React, { useState, useEffect, useRef } from 'react';
import "../css/header.css";
import logo from './logo.png';
import menu from './menu.png';
import {useNavigate} from "react-router-dom";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState("Select an option");
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const handleSelect = (value) => {
        setSelected(value);
        console.log("Selected value:", value);
        setIsOpen(false);
    };

    const handleToHome = () => {
        navigate("/");
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        // Attach the click event listener
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            // Remove the click event listener
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="header">
            <div className="header-logo" onClick={handleToHome}>
                <img src={logo} alt="MarkWise Logo" className="logo" />
                <p>MarkWise</p>
            </div>
            <div className="custom-dropdown" ref={dropdownRef}>
                <div onClick={() => setIsOpen(!isOpen)} className="dropdown-header">
                    <img src={menu} alt="Menu" className="logo" />
                </div>
                {isOpen && (
                    <div className="dropdown-options">
                        <div onClick={() => handleSelect("About MarkWise")}>About MarkWise</div>
                        <div onClick={() => handleSelect("About the team")}>About the team</div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
