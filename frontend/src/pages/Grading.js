import React, {useContext, useEffect, useMemo, useState} from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Button, TableFooter, Alert, DialogTitle, DialogContent, DialogContentText, DialogActions, Dialog, LinearProgress,
} from '@mui/material';
import SearchableSelect from "../components/SearchableSelect";
import "../css/GradeTable.css";
import Header from "../components/Header";
import ProgressBar from "../components/Progress";
import AppContext from "../util/context";
import {useNavigate} from "react-router-dom";

const GradingCell = ({item, currentStudentGrade, setCurrentStudentGrade}) => {
    // for select the feedback purpose
    const [selectedRating, setSelectedRating] = useState(null);
    const [isSelectOpen, setIsSelectOpen] = useState(false);
    const [isCustomGradeOpen, setIsCustomGradeOpen] = useState(false);

    useEffect(() => {
        if(currentStudentGrade[item.question_title]) {
            if (currentStudentGrade[item.question_title].customMark) {
                setIsCustomGradeOpen(true);
            } else {
                setIsCustomGradeOpen(false);
            }
        } else {
            setIsCustomGradeOpen(false);
        }
    }, [currentStudentGrade]);

    const handleGradeClick = (rating) => {

        // set the current student grade
        if (!currentStudentGrade[item.question_title]) {
            const newStudentGrade = {"mark": rating.mark, "feedback": null, "customMark": null, "customFeedback": null};
            setCurrentStudentGrade((prevGrade) => {
                return {...prevGrade, [item.question_title]: newStudentGrade}
            })
        } else {
            // ensure the input feedback can exist with the selected mark
            const newStudentGrade = {...currentStudentGrade[item.question_title], "feedback": null, "mark": rating.mark, "customMark": null}
            setCurrentStudentGrade((prevGrade) => {
                return {...prevGrade, [item.question_title]: newStudentGrade}
            })
        }
        // only for showing all related feedbacks
        setSelectedRating(rating);
        // no need to open the feedback select
        setIsSelectOpen(false);
        setIsCustomGradeOpen(false);
    };

    // it would be invoked when the user select the grade firstly and then select the feedback
    const handleFeedbackClick = (event, newValue) => {
        let studentGrade = currentStudentGrade[item.question_title];
        if (studentGrade) {
            // ensure selected feedback cannot exist with the custom mark and custom feedback
            studentGrade = {...studentGrade, "feedback": newValue, "customFeedback": null, "customMark": null};
            console.log(studentGrade);
            setCurrentStudentGrade((prevGrade) => {
                return {...prevGrade, [item.question_title]: studentGrade}
            })
        }
    };

    const handleCustomGradeClick = () => {

        // if the user click on the custom grade, then remove the question in the current student grade
        if (currentStudentGrade[item.question_title]) {

            const tempGrade = currentStudentGrade[item.question_title];
            // remove the question if no custom feedback exist
            if (!tempGrade.customFeedback) {
                const newStudentGrade = {...currentStudentGrade};
                delete newStudentGrade[item.question_title];
                setCurrentStudentGrade(newStudentGrade);
            } else {
                // ensure the custom feedback can exist with the custom mark
                const newStudentGrade = {...currentStudentGrade[item.question_title], "feedback": null, "mark": null}
                setCurrentStudentGrade((prevGrade) => {
                    return {...prevGrade, [item.question_title]: newStudentGrade}
                })
            }
        }

        setSelectedRating(null);
        setIsSelectOpen(false);
        setIsCustomGradeOpen(true);
    };

    const handleCustomGradeInput = (event, maxGrade) => {
        //valid the input
        const value = event.target.value;
        if ((value === '') || (!isNaN(value) && parseFloat(value) >= 0 && parseFloat(value) <= maxGrade)) {
            setSelectedRating(null);
            setIsSelectOpen(false);
            setIsCustomGradeOpen(true);


            // set the current student grade
            if (!currentStudentGrade[item.question_title]) {
                const newStudentGrade = {"customMark": value, "feedback": null, "mark": null, "customFeedback": null};
                setCurrentStudentGrade((prevGrade) => {
                    return {...prevGrade, [item.question_title]: newStudentGrade}
                })
            } else {
                const newStudentGrade = {...currentStudentGrade[item.question_title], "feedback": null, "customMark": value}
                setCurrentStudentGrade((prevGrade) => {
                    return {...prevGrade, [item.question_title]: newStudentGrade}
                })
            }
        } else if (value === '') {
            setIsCustomGradeOpen(false);
        }
    }

    const checkSelectedRating = (rating) => {
        if (!currentStudentGrade[item.question_title]) {
            return false;
        }

        if (currentStudentGrade[item.question_title].mark === rating) {
            return true;
        }
    }

    const handleBlur = (event) => {
        if (event.target.value === '') {
            setIsCustomGradeOpen(false);
        }
    };


    return (
        <div className="grading-container">
            <div className="grade-circles-container">
                {item.ratings.map((rating, index) => (
                    <div
                        key={index}
                        className={`grade-circle ${checkSelectedRating(rating.mark) ? 'grade-circle-selected' : ''}`}
                        onClick={() => handleGradeClick(rating)}
                    >
                        {rating.mark}
                    </div>
                ))}
                <div className="grade-circle grade-circle-custom">
                    <input type="text" onClick={handleCustomGradeClick}
                           onChange={(e) => handleCustomGradeInput(e, item.marks)}
                           value={currentStudentGrade[item.question_title] ? (currentStudentGrade[item.question_title].customMark ? currentStudentGrade[item.question_title].customMark:'' ): ''}
                           className={isCustomGradeOpen ? 'grade-circle-custom-input-open' : null}
                           onBlur={handleBlur}
                    />

                </div>
            </div>

            <div className="searchable-select">
                <SearchableSelect
                    options={selectedRating ? selectedRating.feedbacks : []}
                    label="Select Feedback"
                    value={currentStudentGrade[item.question_title] ? currentStudentGrade[item.question_title].feedback : null}
                    onChange={handleFeedbackClick}
                    open={isSelectOpen}
                    onOpen={() => setIsSelectOpen(true)}
                    onClose={() => setIsSelectOpen(false)}
                />
            </div>
        </div>
    );
};


const GradingTable = ({rubric, currentStudentGrade, setCurrentStudentGrade}) => {

    const [currentMark, setCurrentMark] = useState(0);

    let totalMark = 0;
    for (const item of rubric) {
        totalMark += item.marks;
    }

    useEffect(() => {

        let currentMark = 0;
        const keys = Object.keys(currentStudentGrade);
        for (const key of keys) {
            if (currentStudentGrade[key].mark) {
                currentMark += currentStudentGrade[key].mark;
            } else if (currentStudentGrade[key].customMark) {
                currentMark += parseFloat(currentStudentGrade[key].customMark);
            }
        }
        setCurrentMark(currentMark);

    }, [currentStudentGrade]);

    const handleCustomFeedbackInput = (event, questionTitle) => {
        const value = event.target.value;
        // set the current student grade
        if (!currentStudentGrade[questionTitle]) {
            const newStudentGrade = {"customFeedback": value, "feedback": null, "mark": null, "customMark": null};
            setCurrentStudentGrade((prevGrade) => {
                return {...prevGrade, [questionTitle]: newStudentGrade}
            })
        } else {
            const newStudentGrade = {...currentStudentGrade[questionTitle], "customFeedback": value, "feedback": null}
            setCurrentStudentGrade((prevGrade) => {
                return {...prevGrade, [questionTitle]: newStudentGrade}
            })
        }
    };


    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Question</TableCell>
                    <TableCell>Grading</TableCell>
                    <TableCell>Feedback</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {rubric.map((item, index) => (
                    <TableRow key={item.question_title}>
                        <TableCell sx={{fontSize: 20}}>{item.question_title}</TableCell>
                        <TableCell>
                            <GradingCell
                                item={item}
                                currentStudentGrade={currentStudentGrade}
                                setCurrentStudentGrade={setCurrentStudentGrade}
                            />
                        </TableCell>
                        <TableCell>
                            <div className="feedback-container">
                                <TextField
                                    multiline
                                    variant="outlined"
                                    placeholder="Input feedback here"
                                    className="feedback-input"
                                    value={currentStudentGrade[item.question_title] ? (currentStudentGrade[item.question_title].customFeedback ? currentStudentGrade[item.question_title].customFeedback  : '' ): ''}
                                    onChange={(e) => handleCustomFeedbackInput(e, item.question_title)}
                                />
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={2} align="right" sx={{fontSize: 20}}>
                        Total Mark:
                    </TableCell>
                    <TableCell className="total-mark-value" sx={{fontSize: 20}}>
                        {currentMark}/{totalMark}
                    </TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    )


};

const GradingPage = () => {
    /* navigation */
    const {activeStep, setActiveStep, serverUrl, handleClassUpload} = useContext(AppContext);
    const {classUploaded, rubricUploaded} = useContext(AppContext);
    const navigate = useNavigate();

    /* data section */
    const {fetchedRubric, fetchedClassList, currentStudentIndex, setCurrentStudentIndex} = useContext(AppContext);

    /* only used in this page */
    const [rubricData, setRubricData] = useState(null);
    const [classListData, setClassListData] = useState(null);

    // store the student grade, the format is below
    // {
    //     "question_title": {
    //         "mark": concrete make,
    //         "feedback": concrete feedback,
    //          "customMark": concrete custom mark
    //          "customFeedback": concrete custom feedback
    //     }
    // }
    const [currentStudentGrade, setCurrentStudentGrade] = useState({});
    const [previousStudentGrade, setPreviousStudentGrade] = useState({});

    /* edit section */
    const [isModified, setIsModified] = useState(false);

    /* select student*/
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [previousSelectedStudent, setPreviousSelectedStudent] = useState(null);

    /* error processing*/
    const [error, setError] = useState(null);

    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [path, setPath] = useState(null);
    const [direction, setDirection] = useState(0);

    /* marking progress */
    const markedStudentCount = useMemo(() => {
        return classListData ? classListData["class-list"].filter(student => student["Mark Status"]).length : 0;
    }, [classListData]);

    const totalStudentCount = useMemo(() => {
        return classListData ? classListData["class-list"].length : 0;
    }, [classListData]);

    const progress = useMemo(() => {
        return (markedStudentCount / totalStudentCount) * 100;
    }, [markedStudentCount, totalStudentCount]);

    const handleDialogConfirm = () => {
        setConfirmDialogOpen(false);
        setIsModified(false);
        if (path) {
            navigate(path);
        } else {
            if(direction === 1) {
                moveToNextStudent();
            } else if (direction === 2) {
                moveToPreviousStudent();
            } else if (direction === 3 ) {
                changeStudent();
            }
        }
    };

    const handleDialogCancel = () => {
        setConfirmDialogOpen(false);
        if (previousSelectedStudent) {
            setSelectedStudent(previousSelectedStudent);
        }
    };

    const handleBack = () => {
        if (isModified) {
            setConfirmDialogOpen(true);
        } else {
            navigate("/rubric");
            setActiveStep((prevActiveStep) => prevActiveStep - 1);
        }
    };

    const handleMoveToNextStudent = () => {
        if (isModified) {
            setPath(null);
            setDirection(1);
            setConfirmDialogOpen(true);
            setPreviousSelectedStudent(null);
        } else {
            moveToNextStudent();
        }
    }

    const moveToNextStudent = () => {
        // move to the next student
        const nextStudentIndex = currentStudentIndex + 1;
        setCurrentStudentIndex(nextStudentIndex);
        setSelectedStudent(fetchedClassList["class-list"][nextStudentIndex]);
        // if the student is already marked
        if (fetchedClassList["class-list"][nextStudentIndex]["Mark Status"]) {
            // set the current student grade
            renderStudentIfMarked(nextStudentIndex);
        } else {
            setCurrentStudentGrade({});
            setPreviousStudentGrade({});
        }
    }

    const handleMoveToPreviousStudent = () => {
        if (isModified) {
            setPath(null);
            setDirection(2);
            setConfirmDialogOpen(true);
            setPreviousSelectedStudent(null);
        } else {
            moveToPreviousStudent();
        }
    }

    const moveToPreviousStudent = () => {
        // move to the previous student
        const previousStudentIndex = currentStudentIndex - 1;
        setCurrentStudentIndex(previousStudentIndex);
        setSelectedStudent(fetchedClassList["class-list"][previousStudentIndex]);
        // if the student is already marked
        if (fetchedClassList["class-list"][previousStudentIndex]["Mark Status"]) {
            // set the current student grade
            renderStudentIfMarked(previousStudentIndex);
        } else {
            setCurrentStudentGrade({});
            setPreviousStudentGrade({});
        }
    }

    const handleChangeStudent = (event, newValue) => {
        // check the modification state
        if (isModified) {
            setPath(null);
            setDirection(3);
            setConfirmDialogOpen(true);
            setPreviousSelectedStudent({...selectedStudent});
            if (newValue) {
                setSelectedStudent(newValue);
            }
        } else {
            // ensure the user select a student
            if (newValue) {
                // move to the student and need to search for the data
                setSelectedStudent(newValue);
                // find the index of the selected student
                for (const item of fetchedClassList["class-list"]) {
                    if (item["Student UPI"] === newValue["Student UPI"]) {
                        const targetIndex = fetchedClassList["class-list"].indexOf(item);
                        setCurrentStudentIndex(targetIndex);
                        if (newValue["Mark Status"]) {
                            // set the current student grade
                            renderStudentIfMarked(targetIndex);
                        } else {
                            setCurrentStudentGrade({});
                            setPreviousStudentGrade({});
                        }
                        break;
                    }
                }
            }
        }
    }

    const changeStudent = () => {
        if(selectedStudent) {
            for (const item of fetchedClassList["class-list"]) {
                if (item["Student UPI"] === selectedStudent["Student UPI"]) {
                    const targetIndex = fetchedClassList["class-list"].indexOf(item);
                    setCurrentStudentIndex(targetIndex);
                    if (selectedStudent["Mark Status"]) {
                        // set the current student grade
                        renderStudentIfMarked(targetIndex);
                    } else {
                        setCurrentStudentGrade({});
                        setPreviousStudentGrade({});
                    }
                    break;
                }
            }
        }
    }

    const renderStudentIfMarked = (index) => {
        const currentStudentGrade = {};
        for (const item of fetchedClassList["class-list"][index]["Marks"]) {
            currentStudentGrade[item["question_title"]] = {
                "mark": item["mark"],
                "feedback": item["feedback"],
                "customMark": item["customMark"],
                "customFeedback": item["customFeedback"]
            }
        }
        setCurrentStudentGrade(currentStudentGrade);
        setPreviousStudentGrade(JSON.parse(JSON.stringify(currentStudentGrade)));
    }

    const constructNewClassListData = () => {
        const newStudentGrade = classListData["class-list"][currentStudentIndex];
        newStudentGrade["Mark Status"] = true;
        newStudentGrade["Marks"] = [];
        const keys = Object.keys(currentStudentGrade);
        for (const key of keys) {
            newStudentGrade["Marks"].push({
                "question_title": key,
                "mark": currentStudentGrade[key].mark,
                "feedback": currentStudentGrade[key].feedback,
                "customMark": parseFloat(currentStudentGrade[key].customMark),
                "customFeedback": currentStudentGrade[key].customFeedback
            })
        }
        const newClassListData = {...classListData};
        newClassListData["class-list"][currentStudentIndex] = newStudentGrade;
        return newClassListData;
    }

    /* ensure the marker complete the mark for one student*/
    const checkMarkComplete = () => {
        // check the marker complete all questions
        if (Object.keys(currentStudentGrade).length !== rubricData["rubric"].length) {
            return false;
        }
        // check the marker give each question a mark (either mark or custom mark)
        const keys = Object.keys(currentStudentGrade);
        for (const key of keys) {
            if (!currentStudentGrade[key].mark && !currentStudentGrade[key].customMark) {
                return false;
            }
        }
        return true;
    }

    const handleSaveClassList = async (classListId) => {
        let newClassData = null;
        if (checkMarkComplete()) {
            // construct the new class list data
            newClassData = constructNewClassListData();
            try {
                const response = await fetch(`${serverUrl}/class-list/${classListId}`, {
                    method: 'PUT',
                    body: JSON.stringify(newClassData),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    // update the global state
                    handleClassUpload(JSON.parse(JSON.stringify(data)), true);
                    setIsModified(false);
                    setClassListData(data);
                    setError(null);
                } else {
                    setError("failed to save class list");
                }
            } catch (error) {
                setError("There was a problem saving the class list");
            }
        } else {
            setError("Please complete the mark for the student");
        }
    }

    const handleCancel = () => {
        if (fetchedClassList["class-list"][currentStudentIndex]["Mark Status"]) {
            // set the current student grade
            renderStudentIfMarked(currentStudentIndex);
        } else {
            setCurrentStudentGrade({});
            setPreviousStudentGrade({});
        }

        setIsModified(false);
        setError(null);
    }

    const checkAllMarked = () => {
        for (const item of fetchedClassList["class-list"]) {
            if (!item["Mark Status"]) {
                return false;
            }
        }
        return true;
    }

    const handleMoveToFinalStep = () => {
        if (checkAllMarked()) {
            setActiveStep(3);
            navigate("/download");
        } else {
            alert("Please mark all students");
        }
    }

    useEffect(() => {
        if (!classUploaded) {
            navigate("/class");
            setActiveStep(0);
            return;
        }

        if (!rubricUploaded) {
            navigate("/rubric");
            setActiveStep(1);
            return;
        }

        // ensure rubric and class list data are deep copy
        if (fetchedRubric) {
            setRubricData(JSON.parse(JSON.stringify(fetchedRubric)));
        }

        if (fetchedClassList) {
            console.log(fetchedClassList);
            setClassListData(JSON.parse(JSON.stringify(fetchedClassList)));
        }

        setCurrentStudentGrade({});
        // set the current student grade if the current select student is marked
        if (fetchedClassList && fetchedRubric && fetchedClassList["class-list"][currentStudentIndex]["Mark Status"]) {
            renderStudentIfMarked(currentStudentIndex);
        }

        if (fetchedClassList) {
            setSelectedStudent(fetchedClassList["class-list"][currentStudentIndex]);
        }

        // default to non-edit state
        setIsModified(false);
        setError(null);
        setPath(null);
    }, []);

    // detect for the modification
    useEffect(() => {
        if (JSON.stringify(currentStudentGrade) !== JSON.stringify(previousStudentGrade)) {
            setIsModified(true);
        } else {
            setIsModified(false);
        }
    }, [currentStudentGrade])

    return (
        <div className={"main-page"}>
            <div className={"progress"}>
                <ProgressBar activeStep={activeStep} setActiveStep={setActiveStep}
                             handleBack={handleBack}></ProgressBar>
            </div>
            <div className={"content"}>
                <Header></Header>
                {rubricData && classListData &&
                    <div className={"grading-section"}>
                        <div className={"grading-operations"}>
                            <div className="grading-operation-part1">
                                <SearchableSelect
                                    options={classListData["class-list"]}
                                    label={"Select Student"}
                                    getOptionLabel={option => option["Student UPI"]}
                                    value={selectedStudent ? selectedStudent : null}
                                    onChange={handleChangeStudent}
                                    renderOption={(props, option) => (
                                        <li {...props}>
                                            <span>{option["Student UPI"]}:</span>
                                            <span>{option["Mark Status"] ? "Marked" : "NotMarked"}</span>
                                        </li>
                                    )}
                                    style={{width: 200}}
                                    isOptionEqualToValue={(option, value) => option._id === value._id}
                                ></SearchableSelect>
                            </div>

                            <div className={"grading-operation-part2"}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    disabled={currentStudentIndex === 0}
                                    onClick={handleMoveToPreviousStudent}
                                >PREVIOUS STUDENT</Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    disabled={currentStudentIndex === fetchedClassList["class-list"].length - 1}
                                    onClick={handleMoveToNextStudent}
                                >NEXT STUDENT</Button>
                                <Button
                                    variant={"contained"}
                                    color={"warning"}
                                    onClick={handleMoveToFinalStep}
                                >
                                    Save & Exit
                                </Button>
                            </div>
                        </div>

                        <div className="grading-table">
                            <GradingTable rubric={rubricData["rubric"]}
                                          currentStudentGrade={currentStudentGrade}
                                          setCurrentStudentGrade={setCurrentStudentGrade}
                            ></GradingTable>
                        </div>
                        {error && <Alert severity={"error"} >{error}</Alert>}
                        <div className={"grading-operation-part3"}>
                            <Button variant={"contained"} color={"error"} disabled={!isModified} onClick={handleCancel}>CANCEL</Button>
                            <Button variant={"contained"} color={"primary"} disabled={!isModified} onClick={() => handleSaveClassList(fetchedClassList["_id"])}>CONFIRM</Button>
                        </div>
                    </div>
                }
                {(!rubricData || !classListData) && <div className="loading">Loading...</div>}
                <div className={"progress-bar-container"}>
                    <LinearProgress variant="determinate" value={progress} />
                    <div className={"progress-label"}>
                        {`${markedStudentCount}/${totalStudentCount} Students Marked`}
                    </div>
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
        </div>
    )
}

export default GradingPage;