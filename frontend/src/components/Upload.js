import "../css/Common.css";
import {useDropzone} from "react-dropzone";
import React, {useState} from "react";
import {Alert, Button} from "@mui/material";
import downloadFile from "../util/downloadUtil";


const Upload = ({uploadDescription, serverUrl, handleSuccessfullyUpload, downloadUrl, filename}) => {

    const [fileSelected, setFileSelected] = useState(false);
    const [error, setError] = useState(null);

    const onDropAccepted = () => {
        setFileSelected(true);
        setError(null);
    }

    const onFileDialogOpen = () => {
        setFileSelected(false);
        setError(null);
    }

    const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
        onDropAccepted,
        onFileDialogOpen,
        accept: {
            'application/json': ['.json']
        },
        multiple: false,
    });

    const handleUpload = async () => {
        const file = acceptedFiles[0];
        if (file) {
            try {
                const formData = new FormData();
                formData.append('jsonFile', file);

                const response = await fetch(serverUrl, {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const data = await response.json();
                    setError(null);
                    handleSuccessfullyUpload(data);
                } else {
                    response.text().then(text => setError(text));
                }
            } catch (error) {
                setError(`There was a problem with the server`);
            }
        } else {
            setError("Please select a file to upload");
        }
    }


    const files = acceptedFiles.map(file =>
        <div key={file.name}>{file.name} - {file.size} bytes</div>
    );

    return (
        <div className="upload">
            <div className="upload-description">{uploadDescription}</div>
            <div>
                <div {...getRootProps({className: 'dropzone'})}>
                    <input {...getInputProps()} />
                    <p>Drag 'n' drop class list Json file here, or click to select file</p>
                </div>
                <aside className={"uploaded-files"}>
                    <h4>Selected File:</h4>
                    {files}
                </aside>
            </div>
            <div className="error">
                {error && <Alert severity="error">{error}</Alert>}
            </div>
            <div className="upload-button">
                <Button variant="contained" color="primary" onClick={handleUpload} disabled={!fileSelected}
                        sx={{width: 300, fontSize: 20}}>
                    UPLOAD
                </Button>
                <Button variant="contained" color="primary" onClick={() => downloadFile(downloadUrl, filename)} sx={{width: 300, fontSize: 20}}>
                    Download Sample File
                </Button>
            </div>
        </div>
    );

}

export default Upload;