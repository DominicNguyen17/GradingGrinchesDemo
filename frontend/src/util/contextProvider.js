import React, {useState} from 'react';
import AppContext from "./context";

const AppProvider = ({children}) => {
    const [rubricUploaded, setRubricUploaded] = useState(false);

    const [classUploaded, setClassUploaded] = useState(false);
    const [classListId, setClassListId] = useState(null);

    const handleRubricUpload = () => {
        setRubricUploaded(!rubricUploaded);
    }

    const handleClassUpload = (class_list_id, isUploaded) => {
        setClassUploaded(isUploaded);
        setClassListId(class_list_id);
    }

    return (
        <AppContext.Provider value={{
            rubricUploaded, handleRubricUpload,
            classUploaded, handleClassUpload, classListId
        }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider;
