import {useContext, useEffect, useState} from "react";
import AppContext from "../util/context";
import Header from "../components/header";
import Container from "../components/container";
import {Link} from "react-router-dom";
import "../css/class.css";

const Class = () => {

    const {classUploaded, handleClassUpload, classListId} = useContext(AppContext);
    const [fetchedClassList, setFetchedClassList] = useState(null);


    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const fileInput = e.target.elements.jsonFile;
        const file = fileInput.files[0];
        const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:8888';
        if (file) {
            try {
                const response = await fetch(`${serverUrl}/class-list/upload`, {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    handleClassUpload(data.id, true);
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

    useEffect(() => {
        console.log("useEffect triggered. Current classListId:", classListId); // Debugging line
        if (classListId) {
            const fetchClassList = async () => {
                const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:8888';
                try {
                    const response = await fetch(`${serverUrl}/class-list/${classListId}`);
                    if (response.ok) {
                        const data = await response.json();
                        setFetchedClassList(data); // Set the fetched data to state
                    } else {
                        console.error("Failed to fetch class list");
                    }
                } catch (error) {
                    console.error("There was a problem fetching the class list", error);
                }
            };

            fetchClassList();
        }
    }, [classListId])

    return (
        <div>
            <Header></Header>
            {classUploaded ?
                <div>
                    <h1>Class List</h1>
                    {fetchedClassList ? (
                        <table className="fetched-class-table">
                            <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Class ID</th>
                                <th>Assignment ID</th>
                            </tr>
                            </thead>
                            <tbody>
                            {fetchedClassList["class-list"].map((item, index) => (
                                <tr key={index}>
                                    <td>{item["Student ID"]}</td>
                                    <td>{item["Class ID"]}</td>
                                    <td>{item["Assignment ID"]}</td>
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
                            <input type="file" name="jsonFile" accept=".json" />
                            <input type="submit" value="Upload" />
                        </form>
                    </Container>
                </div>
            }
            <Link to={"/"}>Back to Home</Link>
        </div>
    );
}

export default Class;
