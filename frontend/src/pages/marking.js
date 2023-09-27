import {useContext, useEffect, useState} from "react";
import AppContext from "../util/context";
import Header from "../components/header";
import Container from "../components/container";
import {Link} from "react-router-dom";
import "../css/marking.css";
import "../css/common.css"

const Marking = () => {

    const {classUploaded, rubricUploaded, fetchedClassList, fetchedRubric, serverUrl} = useContext(AppContext);
    const {currentStudentIndex, setCurrentStudentIndex} = useContext(AppContext);
    const {markedStudents, isStudentMarked, markStudent, unmarkStudent} = useContext(AppContext);

    // marking state for the current student
    const [studentMarking, setStudentMarking] = useState({});

    const get_student_ID = () => {
        if (fetchedClassList && fetchedRubric) {
            return fetchedClassList["class-list"][currentStudentIndex]["Student ID"];
        }
        return null;
    }

    const move_to_next_student = () => {
        if (currentStudentIndex < fetchedClassList["class-list"].length - 1) {
            setCurrentStudentIndex(currentStudentIndex + 1);
            setStudentMarking({})
        }
    }

    const move_to_previous_student = () => {
        if (currentStudentIndex > 0) {
            setCurrentStudentIndex(currentStudentIndex - 1);
            setStudentMarking({})
        }
    }

    useEffect(() => {
        const studentID = get_student_ID();
        if (isStudentMarked(studentID)) {
            fetchStudentMarkingData(studentID).then(r => console.log("fetched student marking data"));
        }
    }, [currentStudentIndex]); // Dependency on currentStudentIndex ensures the effect runs when the student changes


    const fetchStudentMarkingData = async (studentID) => {

        // if(studentID === "3") {
        //     setStudentMarking(
        //              {
        //                 1: {
        //                     "grade": '3',
        //                     "feedback": "content1"
        //                 },
        //                 2: {
        //                     "grade": "2",
        //                     "feedback": "conetent2"
        //                 },
        //             }
        //     )
        // }

        try {
            // Assuming your server expects a URL like "/studentMarks/{studentID}"
            const response = await fetch(`${serverUrl}/marking?studentID=${studentID}&classListId=${fetchedClassList["_id"]}`);
            if (!response.ok) {
                console.error("Error fetching student marking data:", response.status, response.statusText);
            }
            const data = await response.json();
            // Todo - process the data to get the format you want

            setStudentMarking(data); // Store the fetched data in the state
        } catch (err) {
            console.error("Error fetching student marking data:", err)
        }
    };


    const handle_save_and_exit = async () => {

        const allFilled = fetchedRubric["rubric"].every(question => {
            return studentMarking[question["question_title"]]?.grade && studentMarking[question["question_title"]]?.feedback;
        });

        if (!allFilled) {
            alert("Please complete all grade and feedback selections before submitting.");
            return;
        }
        // for debug purpose
        console.log(studentMarking);
        try {
            const response = await fetch(`${serverUrl}/marking`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    classListId: fetchedClassList["_id"],
                    studentID: get_student_ID(),
                    marking: studentMarking,
                }),
            });

            const data = await response.json();
            if(response.ok) {
                // handle success scenario, maybe navigate somewhere or show a success message
                markStudent(get_student_ID());
            } else {
                // handle errors based on what your backend sends
                console.error(data);
            }
        } catch (error) {
            console.error("Error sending data to the server:", error);
        }


    }

    return (
        <div className="main-page">
            <Header></Header>
            {classUploaded && rubricUploaded && fetchedClassList && fetchedRubric ? (
                    <div className="marking">
                        <div className="marking-header">
                            <div className="marking-student">
                                Student ID: {get_student_ID()}
                            </div>
                            <div className="marking-operations">
                                <button className="blue-button" onClick={move_to_previous_student}>Previous</button>
                                <button className="blue-button" onClick={move_to_next_student}>Next</button>
                                <button className="red-button" onClick={handle_save_and_exit}>Save & Exit</button>
                            </div>
                        </div>
                        <div className="marking-body">
                            <table className="marking-table">
                                <thead>
                                <tr>
                                    <th>Question</th>
                                    <th>Marks Out Of</th>
                                    <th>Marker Comments</th>
                                    <th>Grade</th>
                                    <th>Feedback Response</th>
                                </tr>
                                </thead>
                                <tbody>
                                {fetchedRubric["rubric"].map((question, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{question["question_title"]}</td>
                                            <td>{question["marks"]}</td>
                                            <td>{question["marker comments"]}</td>

                                            <td>
                                                <select value={studentMarking[question["question_title"]]?.grade || ''}
                                                        onChange={e => setStudentMarking(prev => ({...prev,
                                                            [question["question_title"]]: {
                                                                ...prev[question["question_title"]],
                                                                grade: e.target.value
                                                            }
                                                        }))}>
                                                    <option value="" disabled hidden>Select a grade</option>
                                                    {Array.from({length: question["marks"] + 1}, (_, i) => i).map((item, index) => (
                                                        <option key={index}>{item}</option>)
                                                    )}
                                                </select>
                                            </td>
                                            <td>
                                                <select value={studentMarking[question["question_title"]]?.feedback || ''}
                                                        onChange={e => setStudentMarking(prev => ({...prev,
                                                            [question["question_title"]]: {
                                                                ...prev[question["question_title"]],
                                                                feedback: e.target.value
                                                            }
                                                        }))}>
                                                    <option value="" disabled hidden>Select a feedback</option>
                                                    {question["feedbacks"].map((feedback, index) => (
                                                        <option key={index}>{feedback["feedback"]}</option>)
                                                    )}
                                                </select>
                                            </td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>)
                : (<div className="description">Please upload rubric and class list before marking</div>)}
            <div>
                <Link className="link" to={"/"}>Back to Home</Link>
            </div>
        </div>
    );
}

export default Marking;
