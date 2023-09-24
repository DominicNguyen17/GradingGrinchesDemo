import {useContext} from "react";
import AppContext from "../util/context";
import Container from "../components/container";
import Header from "../components/header";
import {Link} from "react-router-dom";

const Rubric = () => {

    const {rubricUploaded, handleRubricUpload} = useContext(AppContext);

    return <div>
        <Header></Header>
        <div className="rubric">
            {rubricUploaded ? <div>Rubric showing page</div> : <Container>
                <div>Upload Rubric</div>
            </Container>}
        </div>
        <Link to={"/"}>Back to Home</Link>
    </div>

}

const Section = () => {

}

const Ratings = () => {

}




export default Rubric;