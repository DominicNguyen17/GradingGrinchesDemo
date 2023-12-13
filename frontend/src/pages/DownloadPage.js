import React, { useState } from 'react';
import AppContext from "../util/context";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import ProgressBar from "../components/Progress";
import Header from "../components/Header";
import {
    Button,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Typography,
} from '@mui/material';
import downloadFile from "../util/downloadUtil";


const DownloadPage = () => {
    const {
        serverUrl,
        classUploaded,
        rubricUploaded,
        handleRubricUpload,
        fetchedRubric,
        fetchedClassList,
    } = useContext(AppContext);
    const { activeStep, setActiveStep } = useContext(AppContext);
    const navigate = useNavigate();

    const [downloadOption, setDownloadOption] = useState('.json');

    const handleBack = () => {
        navigate("/marking");
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return (
        <div className={"main-page"}>
            <div className={"progress"}>
                <ProgressBar activeStep={activeStep} setActiveStep={setActiveStep}
                             handleBack={handleBack}></ProgressBar>
            </div>
            <div className={"content"}>
                <Header></Header>
                <h1>Download Marks</h1>
                {/*<div className="preview-section">*/}
                {/*    <Typography variant="h6">Preview:</Typography>*/}
                {/*    <div className="preview-content"> /!* previewContent *!/ </div>*/}
                {/*</div>*/}
                <div className={"download"}>
                    <FormControl component="fieldset">

                        <FormLabel component="legend">Select Download Option</FormLabel>
                        <br />
                        <RadioGroup
                            aria-label="download-options"
                            name="download-options"
                            value={downloadOption}
                            onChange={(e) => setDownloadOption(e.target.value)}
                        >
                            <FormControlLabel value=".csv" control={<Radio />} label=".csv" />
                            <FormControlLabel value=".json" control={<Radio />} label=".json" />
                        </RadioGroup>
                    </FormControl>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => downloadFile(`${serverUrl}/download/marking/${fetchedClassList["_id"]}`, "markingData" + downloadOption)}
                    >
                        Download
                    </Button>
                </div>

            </div>
        </div>
    )
}

export default DownloadPage;
