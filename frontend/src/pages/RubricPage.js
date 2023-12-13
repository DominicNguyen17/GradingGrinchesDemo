import React, {useContext, useEffect, useState} from "react";
import Header from "../components/Header";
import "../css/Rubric.css";
import '../css/Common.css';
import AppContext from "../util/context";
import Upload from "../components/Upload";
import {Button} from "@mui/material";
import {useNavigate} from "react-router-dom";
import RubricTable from "../components/RubricTable";
import ProgressBar from "../components/Progress";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';


const RubricPage = () => {
    const {serverUrl, classUploaded, rubricUploaded, handleRubricUpload, fetchedRubric} = useContext(AppContext);
    const {activeStep, setActiveStep} = useContext(AppContext);
    const [rubricContent, setRubricContent] = useState(null);
    const navigate = useNavigate();
    // modification check
    const [isModified, setIsModified] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

    // store the path
    const [path, setPath] = useState(null);

    useEffect(() => {
        if (JSON.stringify(rubricContent) !== JSON.stringify(fetchedRubric)) {
            setIsModified(true);
        }
    }, [rubricContent, fetchedRubric]);

    const handleSuccessfullyUpload = (data) => {
        setRubricContent(data);
        // ensure the global state is deep copy
        handleRubricUpload(JSON.parse(JSON.stringify(data)), true);
    }

    const handleRemoveRubric = () => {
        setRubricContent(null);
        handleRubricUpload(null, false);
    }

    const handleBack = () => {
        if (isModified) {
            setConfirmDialogOpen(true);
            setPath("/class");
        } else {
            navigate("/class");
            setActiveStep((prevActiveStep) => prevActiveStep - 1);
        }
    };

    const handleNext = () => {
        if (isModified) {
            setConfirmDialogOpen(true);
            setPath("/marking");
        } else {
            navigate("/marking");
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };


    const handleDialogConfirm = () => {
        setConfirmDialogOpen(false);
        setIsModified(false);
        if (path === "/marking") {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            navigate(path);
        } else if (path === "/class") {
            setActiveStep((prevActiveStep) => prevActiveStep - 1);
            navigate(path);
        }

    };

    const handleSaveRubric = async (rubricId) => {
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
                handleRubricUpload(JSON.parse(JSON.stringify(data)), true);
                setIsModified(false);
                setConfirmDialogOpen(false);
                setRubricContent(data);
            } else {
                console.error("Failed to save rubric");
                console.log(rubricContent)
            }
        } catch (error) {
            console.error("There was a problem saving the rubric", error);
        }
    }


    const handleDialogCancel = () => {
        setConfirmDialogOpen(false);
    };

    const handleConfirm = () => {
        handleSaveRubric(fetchedRubric["_id"]).then(() => {
            console.log("Rubric saved")
        });
    }

    const handleCancel = () => {
        setRubricContent(JSON.parse(JSON.stringify(fetchedRubric)));
        setIsModified(false);
        setConfirmDialogOpen(false);
    }

    const handleUpdateRubric = (updatedRubric) => {
        setRubricContent({...rubricContent, "rubric": updatedRubric});
    };


    useEffect(() => {
        if (fetchedRubric) {
            setRubricContent(JSON.parse(JSON.stringify(fetchedRubric)));
            setIsModified(false);
        }

        if (!classUploaded) {
            navigate("/class");
            setActiveStep(0);
        }

    }, []);

    return (
        <div className="main-page">
            <div className={"progress"}>
                <ProgressBar activeStep={activeStep} setActiveStep={setActiveStep}
                             handleBack={handleBack}></ProgressBar>
            </div>
            <div className={"content"}>
                <Header></Header>
                {!rubricUploaded &&
                    <div className={"rubric"}>
                    <Upload
                    uploadDescription={"Upload Rubric"}
                    serverUrl={`${serverUrl}/rubric/upload`}
                    handleSuccessfullyUpload={handleSuccessfullyUpload}
                    downloadUrl={`${serverUrl}/download/exampleRubric`}
                    filename={"exampleRubric.json"}
            ></Upload></div>}
                {rubricContent &&
                    <div className={"rubric"}>
                        <div className={"rubric-operations"}>
                            <Button variant="contained" color="error" onClick={handleRemoveRubric}>Remove
                                Rubric</Button>
                            <Button variant="contained" color="primary" onClick={handleNext}>Next</Button>
                        </div>
                        <div>
                            <RubricTable rubricContent={rubricContent["rubric"]}
                                         handleUpdateRubric={handleUpdateRubric}></RubricTable>
                        </div>
                        <div className={"rubric-operations"}>
                            <Button variant={"contained"} color={"error"} disabled={!isModified}
                                    onClick={handleCancel}>Cancel</Button>
                            <Button variant="contained" color="primary" disabled={!isModified}
                                    onClick={handleConfirm}>Confirm</Button>
                        </div>
                    </div>
                }
                {rubricUploaded && !rubricContent && <div className="loading">Loading...</div>}
            </div>
            <Dialog
                open={confirmDialogOpen}
                onClose={handleCancel}
            >
                <DialogTitle>
                    Confirm Navigation
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You have unsaved changes. Are you sure you want to leave this page?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogCancel} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDialogConfirm} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
};

export default RubricPage;
