import Header from "../components/Header";
import "../css/Home.css";
import {Link} from "react-router-dom";

const Home = () => {


    return (
        <div className={"home"}>
            <Header></Header>
            <div className={"marking-description"}>
                Grading Made Easy
            </div>

            <Link className={"big-button"} to={"/class"}>START<br></br>MARKING</Link>
        </div>
    );
}

export default Home;