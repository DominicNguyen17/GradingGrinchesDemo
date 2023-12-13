import "../css/Header.css";
import logo from './correct.png';

const Header = () => {

    return (
        <header className="header">
            <img src={logo} alt="MarkWise Logo" className="logo" />
            <h1>MarkWise</h1>
        </header>
    );
};

export default Header;
