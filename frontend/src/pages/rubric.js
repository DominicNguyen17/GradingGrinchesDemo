import {useContext, useEffect, useState} from "react";
import AppContext from "../util/context";
import Container from "../components/container";
import Header from "../components/header";
import {Link} from "react-router-dom";
import "../css/rubric.css";
import "../css/common.css";

const Rubric = () => {
    const {rubricUploaded, handleRubricUpload, serverUrl, fetchedRubric} = useContext(AppContext);

    // for the rubric upload
    const [rubricId, setRubricId] = useState(null);
    // for edit rubric
    const [editMode, setEditMode] = useState(false);
    const [rubricContent, setRubricContent] = useState(null);
    const [selectedFeedbackIndex, setSelectedFeedbackIndex] = useState([]);

    // once the user upload the rubric, it would return the rubric id
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const fileInput = e.target.elements.jsonFile;
        const file = fileInput.files[0];
        if (file) {
            try {
                const response = await fetch(`${serverUrl}/rubric/upload`, {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const data = await response.json();
                    setRubricId(data.id);
                    // the rubric is uploaded, so we set the rubricUploaded to true
                    handleRubricUpload(null, true);
                    // get the rubric content
                    fetchRubricList(data.id).then(() => console.log("Rubric fetched"));
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

    const fetchRubricList = async (id) => {
        try {
            const response = await fetch(`${serverUrl}/rubric/${id}`);
            if (response.ok) {
                const data = await response.json();
                setRubricContent(data);
                // update the global state
                handleRubricUpload(data, true);
            } else {
                console.error("Failed to fetch rubric");
            }
        } catch (error) {
            console.error("There was a problem fetching the rubric", error);
        }
    };

    const handleEditRubric = () => {
        setEditMode(prevEditMode => !prevEditMode);
        setInitialFeedbackIndices();
    };

    const handleDeleteRow = (index) => {
        const updatedRubric = [...rubricContent.rubric];
        updatedRubric.splice(index, 1);
        setRubricContent({...rubricContent, rubric: updatedRubric});

        // Adjust selected feedback index when deleting rows
        const updatedSelectedFeedbackIndex = [...selectedFeedbackIndex];
        updatedSelectedFeedbackIndex.splice(index, 1);
        setSelectedFeedbackIndex(updatedSelectedFeedbackIndex);
    };


    const handleAddFeedback = (questionIndex) => {
        const feedback = prompt("Enter new feedback content:");
        if (feedback) {
            const updatedRubric = [...rubricContent.rubric];
            updatedRubric[questionIndex]["feedbacks"].push({feedback});
            setRubricContent({...rubricContent, rubric: updatedRubric});
        }
    };

    const handleRemoveFeedback = (questionIndex) => {
        const feedbackIndex = selectedFeedbackIndex[questionIndex];
        if (feedbackIndex !== undefined) {
            const updatedRubric = [...rubricContent.rubric];
            updatedRubric[questionIndex]["feedbacks"].splice(feedbackIndex, 1);
            setRubricContent({...rubricContent, rubric: updatedRubric});

            // update the selected feedback index to the next one
            const updatedSelectedFeedbackIndex = [...selectedFeedbackIndex];
            const candidateFeedbackIndex = feedbackIndex;
            if (candidateFeedbackIndex < updatedRubric[questionIndex]["feedbacks"].length) {
                updatedSelectedFeedbackIndex[questionIndex] = candidateFeedbackIndex;
            } else {
                updatedSelectedFeedbackIndex[questionIndex] = 0;
            }
            setSelectedFeedbackIndex(updatedSelectedFeedbackIndex);
        } else {
            console.error('No feedback selected for question', questionIndex);
        }
    };

    const handleSelectFeedback = (questionIndex, feedbackIndex) => {
        console.log(questionIndex, feedbackIndex);
        const updatedIndices = [...selectedFeedbackIndex];
        updatedIndices[questionIndex] = feedbackIndex;
        setSelectedFeedbackIndex(updatedIndices);
    };

    const handleCancelEdit = async (e) => {
        initialization();
    }

    const handleSaveRubric = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${serverUrl}/rubric/${rubricId}`, {
                method: 'PUT',
                body: JSON.stringify(rubricContent),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                // update the global state
                handleRubricUpload(data, true);
                // exit edit mode
                setEditMode(false);
            } else {
                console.error("Failed to save rubric");
                console.log(rubricContent)
            }
        } catch (error) {
            console.error("There was a problem saving the rubric", error);
        }
    }

    const handleRemoveRubric = async (e) => {
        e.preventDefault();
        handleRubricUpload(null, false);
        setEditMode(false);
    }

    // would be called after the initial render
    useEffect(() => {
        if (fetchedRubric) {
            initialization();
        }
    }, []);

    const initialization = () => {
        setEditMode(false);
        // deep copy the fetched rubric
        setRubricContent(JSON.parse(JSON.stringify(fetchedRubric)));
        setRubricId(fetchedRubric["_id"]);

        // update each question's selected feedback index
        setInitialFeedbackIndices();
    }

    const setInitialFeedbackIndices = () => {
        const initialFeedbackIndices = fetchedRubric.rubric.map(() => 0);
        setSelectedFeedbackIndex(initialFeedbackIndices);
    }


    return (
        <div className="main-page">
            <Header/>
            {rubricUploaded ?
                <div className="rubric">
                    {rubricContent ? (
                        <div>
                            <h1>{rubricContent["assignment title"]}</h1>
                            <p>Owner: {rubricContent["owner"]}</p>
                            <table className="marking-table">
                                <thead>
                                <tr>
                                    <th>Question</th>
                                    <th>Marks Out Of</th>
                                    <th>Marker Comments</th>
                                    <th>Feedbacks</th>
                                    {editMode ? (
                                        <th>
                                            Row Operation
                                        </th>
                                    ) : null}
                                    {editMode ? (
                                        <th>
                                            Feedback Operations
                                        </th>
                                    ) : null}
                                </tr>
                                </thead>
                                <tbody>
                                {rubricContent["rubric"].map((item, index) => (
                                    <tr key={item["question_title"]}>
                                        <td>{item["question_title"]}</td>
                                        <td>{item["marks"]}</td>
                                        <td>{item["marker comments"]}</td>
                                        <td>
                                            <div className="select-container">
                                                <select onChange={(e) => handleSelectFeedback(index, e.target.selectedIndex)}>
                                                {item["feedbacks"].map((feedback, feedbackIndex) => (
                                                        <option key={feedbackIndex}>{feedback["feedback"]}</option>)
                                                    )}
                                                </select>
                                            </div>
                                        </td>
                                        {editMode ? (
                                            <td>
                                                <button className="red-button" onClick={() => handleDeleteRow(index)}>Delete Row</button>
                                            </td>
                                        ) : null }
                                        {editMode ? (
                                            <td className="feedback-operations">
                                                <button className="green-button" onClick={() => handleAddFeedback(index)}>Add Feedback</button>
                                                <button className="red-button" onClick={() => handleRemoveFeedback(index)}>Remove Feedback</button>
                                            </td>
                                        ) : null}

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
            <div className="operations">
                {rubricUploaded ?
                    <div className="operations-upper">
                    {editMode ?
                        <div className="rubric-operations">
                            <button className="red-button" onClick={handleCancelEdit}>Cancel Edit</button>
                            <button className="green-button" onClick={handleSaveRubric}>Save Rubric</button>
                        </div>
                         :
                        <div className="rubric-operations">
                            <button className="red-button" onClick={handleRemoveRubric}>Remove Rubric</button>
                            <button className="green-button" onClick={handleEditRubric}>Edit Rubric</button>
                        </div>
                    }
                </div> : null
                }
                {editMode ? null: <Link className="link" to={"/class"}>Next (Upload Class List)</Link>}
            </div>
        </div>
    )

}


export default Rubric;