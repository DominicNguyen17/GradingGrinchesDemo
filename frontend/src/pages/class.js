import {useContext, useEffect, useState} from "react";
import AppContext from "../util/context";
import Header from "../components/header";
import Container from "../components/container";
import {Link} from "react-router-dom";
import "../css/class.css";
import '../css/common.css'

const Class = () => {

    const {classUploaded, handleClassUpload, rubricUploaded, fetchedClassList, fetchedRubric, serverUrl} = useContext(AppContext);
    // for class List upload
    const [classListId, setClassListId] = useState(null);


    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const fileInput = e.target.elements.jsonFile;
        const file = fileInput.files[0];
        if (file) {
            try {
                const response = await fetch(`${serverUrl}/class-list/upload`, {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const data = await response.json();
                    setClassListId(data.id)
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

    const handleRemoveClassList = async (e) => {
        e.preventDefault();
        handleClassUpload(null, false);
    }

    useEffect(() => {
        if (classListId) {
            const fetchClassList = async () => {
                try {
                    const response = await fetch(`${serverUrl}/class-list/${classListId}`);
                    if (response.ok) {
                        const data = await response.json();
                        console.log(data)
                        handleClassUpload(data, true);
                    } else {
                        console.error("Failed to fetch class list");
                    }
                } catch (error) {
                    console.error("There was a problem fetching the class list", error);
                }
            };
            fetchClassList().then(r => console.log("fetchClassList() called"));
        }
    }, [classListId])

    return (
        <div className="main-page">
            <Header></Header>
            {rubricUploaded ? (<div>{classUploaded ?
                <div className="class-list">
                    <h1>Class List</h1>
                    {fetchedClassList ? (
                        <table className="marking-table">
                            <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Class ID</th>
                                <th>Assignment ID</th>
                                {fetchedRubric["rubric"].map((item, index) => (
                                    <th key={item["question_title"]}>{item["question_title"]}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {fetchedClassList["class-list"].map((item, index) => (
                                <tr key={index}>
                                    <td>{item["Student ID"]}</td>
                                    <td>{item["Class ID"]}</td>
                                    <td>{item["Assignment ID"]}</td>
                                    {fetchedRubric["rubric"].map((item, index) => (
                                        <td key={item["question_title"]}></td>
                                    ))}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <div>Loading...</div>
                    )}
                </div> :
                <div className="class-list">
                    <h1>No Class Lists Available</h1>
                    <p>Please upload your class list following the format below</p>
                    <table className="class-sample-table">
                        <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Class ID</th>
                            <th>Assignment ID</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Sample UPI</td>
                            <td>Sample class ID</td>
                            <td>Sample assignment ID</td>
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
            }</div>) : (<div className="description">You need to upload your rubric firstly</div>)}

            <div className='operations'>
                {classUploaded && rubricUploaded ? <button className="red-button" onClick={handleRemoveClassList}>Remove Class List</button> : null
                }
                <br/>
                <Link className="link" to={"/"}>Back to Home</Link>
            </div>
        </div>
    );
}

export default Class;
