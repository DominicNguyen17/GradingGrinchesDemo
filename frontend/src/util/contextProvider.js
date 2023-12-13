import React, {useState} from 'react';
import AppContext from "./context";

const AppProvider = ({children}) => {
    // // set up the global server url
    // const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:8888';
    const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://ec2-13-210-24-70.ap-southeast-2.compute.amazonaws.com:8888';

    // for progress bar
    const [activeStep, setActiveStep] = React.useState(0);

    // states for rubric upload
    const [rubricUploaded, setRubricUploaded] = useState(false);
    const [fetchedRubric, setFetchedRubric] = useState(null);

    // states for class list upload
    const [classUploaded, setClassUploaded] = useState(false);
    const [fetchedClassList, setFetchedClassList] = useState(null);

    // states for marking
    const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
    const [markedStudents, setMarkedStudents] = useState([]);

    // states for adding the rubric id to class list id
    const [forRubricId, setForRubricId] = useState(false);

    const isStudentMarked = (studentID) => markedStudents.includes(studentID);

    const markStudent = (studentID) => {
        if (!isStudentMarked(studentID)) {
            setMarkedStudents((prevMarked) => [...prevMarked, studentID]);
        }
    };

    const unmarkStudent = (studentID) => {
        setMarkedStudents((prevMarked) => prevMarked.filter(id => id !== studentID));
    };

    const handleClassUpload = (fetchedClassList, isUploaded) => {
        setClassUploaded(isUploaded);
        setFetchedClassList(fetchedClassList);
        setMarkedStudents([]);
    }

    const handleRubricUpload = (fetchedRubric, isUploaded) => {
        setRubricUploaded(isUploaded);
        setFetchedRubric(fetchedRubric);
        setMarkedStudents([]);
    }

    return (
        <AppContext.Provider value={{ activeStep, setActiveStep,
            rubricUploaded, handleRubricUpload, fetchedRubric, currentStudentIndex, setCurrentStudentIndex,
            classUploaded, handleClassUpload, fetchedClassList, serverUrl,
            markedStudents, isStudentMarked, markStudent, unmarkStudent, forRubricId, setForRubricId
        }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider;
