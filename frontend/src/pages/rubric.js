import {useContext, useEffect, useState} from "react";
import AppContext from "../util/context";
import Container from "../components/container";
import Header from "../components/header";
import {Link} from "react-router-dom";
import "../css/rubric.css";

const Rubric = () => {

    const {rubricUploaded, handleRubricUpload, rubricId} = useContext(AppContext);
    const [fetchedRubric, setFetchedRubric] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const fileInput = e.target.elements.jsonFile;
        const file = fileInput.files[0];
        const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:8888';
        if (file) {
            try {
                const response = await fetch(`${serverUrl}/rubric/upload`, {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data);

                    handleRubricUpload(data.id, true);
                } else {
                    console.error("Failed to upload file");
                }
            } catch (error) {
                console.error("There was a problem with the upload", error);
            }
        } else {
            console.error("No file to upload");
        }
    }
    const handleRemoveRubric = async (e) => {
        e.preventDefault();
        setFetchedRubric(null);
        handleRubricUpload(null, false);
    }

    useEffect(() => {
        console.log("useEffect triggered. Current rubricId:", rubricId); // Debugging line
        if (rubricId) {
            const fetchRubricList = async () => {
                const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:8888';
                try {
                    const response = await fetch(`${serverUrl}/rubric/${rubricId}`);
                    if (response.ok) {
                        const data = await response.json();
                        console.log(data);
                        setFetchedRubric(data); // Set the fetched data to state
                    } else {
                        console.error("Failed to fetch class list");
                    }
                } catch (error) {
                    console.error("There was a problem fetching the class list", error);
                }
            };

            fetchRubricList();
        }
    }, [rubricId])

    return (
        <div className="main-page">
            <Header/>
            {rubricUploaded ?
                <div className="rubric">
                    {fetchedRubric ? (
                        <div>
                            <h1>{fetchedRubric["assignment title"]}</h1>
                            <p>Owner: {fetchedRubric["owner"]}</p>
                            <table className="fetched-rubric-table">
                                <thead>
                                <tr>
                                    <th>Question</th>
                                    <th>Marks Out Of</th>
                                    <th>Marker Comments</th>
                                    <th>Feedbacks</th>
                                </tr>
                                </thead>
                                <tbody>
                                {fetchedRubric["rubric"].map((item, index) => (
                                    <tr key={index}>
                                        <td>{item["question_title"]}</td>
                                        <td>{item["marks"]}</td>
                                        <td>{item["marker comments"]}</td>
                                        <td>
                                            <select>
                                                {item["feedbacks"].map((feedback, index) => (
                                                    <option key={index}>{feedback["feedback"]}</option>)
                                                )}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div>Loading...</div>
                    )}
                </div> :
                <div className="rubric">
                    <h1>No Rubric Available</h1>
                    <p>Please upload your rubric following the format below</p>
                    <table className="rubric-sample-table">
                        <thead>
                        <tr>
                            <th>Question</th>
                            <th>Marks Out Of</th>
                            <th>Marker Comments</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>1</td>
                            <td>5</td>
                            <td>Your marker comments</td>
                        </tr>
                        </tbody>
                    </table>
                    <Container>
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <input type="file" name="jsonFile" accept=".json"/>
                            <input type="submit" value="Upload"/>
                        </form>
                    </Container>
                </div>
            }
            <div>
                {rubricUploaded ? <button onClick={handleRemoveRubric}>Remove Rubric</button> : null
                }
                <br/>
                <Link to={"/"}>Back to Home</Link>
            </div>
        </div>
    )

}


export default Rubric;