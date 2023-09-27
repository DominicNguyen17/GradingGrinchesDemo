import Header from "../components/header";
import Container from "../components/container";
import "../css/home.css";
import {Link} from "react-router-dom";

const Home = ({rubricUploaded, handleRubricUpload}) => {

    return <div className="main-page">
        <Header></Header>
        <div className="operations">
            <section className="operation-line">
                <Container>
                    <Link className="operation-name" to={"/rubric"}>
                        Rubric Editing & Upload
                    </Link>
                </Container>
                <Container>
                    <Link className="operation-name" to={"/class"}>
                        Class information & Export
                    </Link>
                </Container>
            </section>
            <section className="operation-line">
                <Container>
                    <Link className="operation-name" to={"/marking"}>
                        Start Marking
                    </Link>
                </Container>
            </section>
        </div>
    </div>

}

export default Home;