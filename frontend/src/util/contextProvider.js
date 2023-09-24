import React, {useState} from 'react';
import AppContext from "./context";

const AppProvider = ({children}) => {
    const [rubricUploaded, setRubricUploaded] = useState(false);
    const [classUploaded, setClassUploaded] = useState(false);

    const [classListId, setClassListId] = useState(null);
    const [rubricId, setRubricId] = useState(null);


    const handleClassUpload = (class_list_id, isUploaded) => {
        setClassUploaded(isUploaded);
        setClassListId(class_list_id);
    }

    const handleRubricUpload = (rubric_id, isUploaded) => {
        setRubricUploaded(isUploaded);
        setRubricId(rubric_id);
    }

    return (
        <AppContext.Provider value={{
            rubricUploaded, handleRubricUpload, rubricId,
            classUploaded, handleClassUpload, classListId
        }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider;
