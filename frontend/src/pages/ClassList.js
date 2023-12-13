import React, {useContext, useEffect, useState} from "react";
import Header from "../components/Header";
import "../css/ClassList.css";
import '../css/Common.css';
import AppContext from "../util/context";
import Upload from "../components/Upload";
import ClassTable from "../components/ClassTable";
import {Button} from "@mui/material";
import {useNavigate} from "react-router-dom";
import ProgressBar from "../components/Progress";

const ClassList = () => {
    const {serverUrl, classUploaded, handleClassUpload, fetchedClassList} = useContext(AppContext);
    const { activeStep, setActiveStep } = useContext(AppContext);
    const [classListContent, setClassListContent] = useState(null);
    const navigate = useNavigate();

    const handleSuccessfullyUpload = (data) => {
        setClassListContent(data);
        handleClassUpload(data, true);
    }

    const handleRemoveClassList = () => {
        setClassListContent(null);
        handleClassUpload(null, false);
    }

    const handleBack = () => {};

    const handleNext = () => {
        // move to next rubric page using useNavigate hook
        navigate("/rubric");
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }

    useEffect(() => {
        if (fetchedClassList) {
            setClassListContent(JSON.parse(JSON.stringify(fetchedClassList)));
        }
        setActiveStep(0);
    }, []);

    return (
        <div className="main-page">
            <div className={"progress"}>
                <ProgressBar activeStep={activeStep} setActiveStep={setActiveStep} handleBack={handleBack}></ProgressBar>
            </div>
            <div className={"content"}>
                <Header></Header>
                {!classUploaded &&
                    <div className={"class-list"}>
                    <Upload
                    uploadDescription={"Upload Class List"}
                    serverUrl={`${serverUrl}/class-list/upload`}
                    handleSuccessfullyUpload={handleSuccessfullyUpload}
                    downloadUrl={`${serverUrl}/download/exampleClassList`}
                    filename={"exampleClassList.json"}
                    ></Upload></div>}
                {classListContent &&
                    <div className={"class-list"}>
                        <div className={"class-list-operations"}>
                            <Button variant="contained" color="error" onClick={handleRemoveClassList}>Remove Class List</Button>
                            <Button variant="contained" color="primary" onClick={handleNext}>Next</Button>
                        </div>
                        <ClassTable ClassList={classListContent}></ClassTable>

                    </div>
                }
                {classUploaded && !classListContent && <div className="loading">Loading...</div>}
            </div>

        </div>
    );
};

export default ClassList;
