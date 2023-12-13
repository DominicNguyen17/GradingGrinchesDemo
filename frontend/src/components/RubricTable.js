import React, {useEffect, useReducer, useState} from 'react';
import {DataGrid} from '@mui/x-data-grid';
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, Grid, IconButton, MenuItem, Select,
    TextField
} from '@mui/material';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';


function reducer(state, action) {
    switch (action.type) {
        case 'ADD_QUESTION':
            return [].concat(state, action.payload);
        case 'DELETE_ROW':
            return state.filter((_, index) => index !== action.payload)
        case 'ADD_FEEDBACK':
            const {rowIndex, ratingIndex, feedback} = action.payload;
            state[rowIndex].ratings[ratingIndex].feedbacks.push(feedback);
            return [].concat(state);
        case 'SET_STATE':
            return action.payload;
        case 'REMOVE_FEEDBACK':
            let {rowIndexRemove, ratingIndexRemove, feedbackIndex} = action.payload;
            state[rowIndexRemove].ratings[ratingIndexRemove].feedbacks.splice(feedbackIndex, 1);
            return [].concat(state);
        default:
            return state;
    }
}


export default function RubricTable({rubricContent, handleUpdateRubric}) {
    const [state, dispatch] = useReducer(reducer, rubricContent);

    // for showing the ratings dialog and add feedback
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentRatings, setCurrentRatings] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [newFeedbacks, setNewFeedbacks] = useState({});
    const [selectedFeedback, setSelectedFeedback] = useState({});

    useEffect(() => {
            handleUpdateRubric(state);
        },
        [state]);

    useEffect(() => {
        dispatch({ type: 'SET_STATE', payload: rubricContent });
    }, [rubricContent]);


    const handleOpenRatingsDialog = (rowData) => {
        setCurrentRatings(rowData.ratings);
        setDialogOpen(true);
        setSelectedQuestion(rowData.question_title);
        setNewFeedbacks({});
        setSelectedFeedback({});
    };

    const handleAddFeedback = (ratingIndex) => {
        if (newFeedbacks[ratingIndex] === undefined || newFeedbacks[ratingIndex] === '') {
            return;
        }
        // find the select row
        const rowIndex = state.findIndex((row) => row.question_title === selectedQuestion);
        const feedbackDataUpdate = {rowIndex, ratingIndex, feedback: newFeedbacks[ratingIndex]};
        dispatch({type: 'ADD_FEEDBACK', payload: feedbackDataUpdate});
        setNewFeedbacks({
            ...newFeedbacks,
            [ratingIndex]: ''
        });
    };

    const handleRemoveFeedback = (ratingIndexRemove) => {
        // check selectedFeedback
        if (!selectedFeedback[ratingIndexRemove]) {
            return;
        }

        // find the select row
        const rowIndexRemove = state.findIndex((row) => row.question_title === selectedQuestion);
        // find the select feedback
        const feedbackIndex = state[rowIndexRemove].ratings[ratingIndexRemove].feedbacks.findIndex((feedback) => feedback === selectedFeedback[ratingIndexRemove]);
        const feedbackDataUpdate = {rowIndexRemove, ratingIndexRemove, feedbackIndex};
        dispatch({type: 'REMOVE_FEEDBACK', payload: feedbackDataUpdate});
        setSelectedFeedback({
            ...selectedFeedback,
            [ratingIndexRemove]: ''
        });
    }

    const handleFeedbackChange = (ratingIndex, event) => {
        setNewFeedbacks({
            ...newFeedbacks,
            [ratingIndex]: event.target.value
        });
    };

    const handleFeedbackSelectChange = (ratingIndex, event) => {
        setSelectedFeedback({
            ...selectedFeedback,
            [ratingIndex]: event.target.value
        });
        setNewFeedbacks({
            ...newFeedbacks,
            [ratingIndex]: event.target.value
        })
    }

    // for add question
    const [addQuestionOpen, setAddQuestionOpen] = useState(false);
    const [newRow, setNewRow] = useState({question_title: '', marks: '', ratings: []});
    const [newRating, setNewRating] = useState({mark: '', feedbacks: ''});
    const [newRatingStatus, setNewRatingStatus] = useState(false);
    const [newRatingError, setNewRatingError] = useState(false);

    const handleCloseQuestionDialog = () => {
        setAddQuestionOpen(false);
        setNewRow({question_title: '', marks: '', ratings: []});
        setNewRating({mark: '', feedbacks: ''});
        setNewRatingStatus(false);
        setNewRatingError(false);
    }

    const handleOpenQuestionDialog = () => {
        setAddQuestionOpen(true);
        setNewRow({question_title: '', marks: '', ratings: []});
        setNewRating({mark: '', feedbacks: ''});
        setNewRatingStatus(false);
        setNewRatingError(false);
    }

    const handleAddRating = () => {
        if (newRating.mark === '') {
            setNewRatingStatus(false);
            setNewRatingError(true);
            return;
        }

        let newRatingItem;
        if (newRating.feedbacks === '') {
            newRatingItem = {mark: parseFloat(newRating.mark), feedbacks: []}
        } else {
            newRatingItem = {mark: parseFloat(newRating.mark), feedbacks: newRating.feedbacks.split(',')};
        }

        setNewRow({...newRow, ratings: [...newRow.ratings, newRatingItem]});
        setNewRating({mark: '', feedbacks: ''});
        setNewRatingStatus(true);
        setNewRatingError(false);
    };

    const handleAddQuestion = () => {
        dispatch({type: 'ADD_QUESTION', payload: newRow});
        setNewRow({question_title: '', marks: '', ratings: []});
        setAddQuestionOpen(false);
    };

    // for remove question
    const handleDeleteRow = (rowData) => {
        const rowIndex = state.findIndex((row) => row.question_title === rowData.question_title);
        dispatch({type: 'DELETE_ROW', payload: rowIndex});
    };

    return (
        <div>
            <Button onClick={handleOpenQuestionDialog}>Add Question</Button>
            <Dialog open={addQuestionOpen} onClose={handleCloseQuestionDialog}>
                <DialogTitle>Add New Question</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Question Title"
                        type="text"
                        fullWidth
                        value={newRow.question_title}
                        onChange={(e) => setNewRow({...newRow, question_title: e.target.value})}
                    />
                    <TextField
                        margin="dense"
                        label="Marks"
                        type="number"
                        fullWidth
                        value={newRow.marks}
                        onChange={(e) => setNewRow({...newRow, marks: e.target.value})}
                    />
                    <TextField
                        margin="dense"
                        label="New Rating Mark"
                        type="number"
                        fullWidth
                        value={newRating.mark}
                        onChange={(e) => setNewRating({...newRating, mark: e.target.value})}
                    />
                    <TextField
                        margin="dense"
                        label="New Feedbacks (Optional, Comma Separated)"
                        type="text"
                        fullWidth
                        value={newRating.feedbacks}
                        onChange={(e) => setNewRating({...newRating, feedbacks: e.target.value})}
                    />
                    {newRatingStatus && <Alert>Add Rating Successfully</Alert>}
                    {newRatingError && <Alert severity="error">Rating is necessary</Alert>}
                    <Button onClick={handleAddRating}>
                        Add Rating
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseQuestionDialog}>Cancel</Button>
                    <Button onClick={handleAddQuestion}>Add Question</Button>
                </DialogActions>
            </Dialog>
            <DataGrid
                rows={state}
                columns={[
                    {field: 'question_title', headerName: 'Question Title', width: 200},
                    {field: 'marks', headerName: 'Marks', width: 100},
                    {
                        field: 'ratings',
                        headerName: 'Ratings',
                        width: 200,
                        renderCell: (params) => (
                            <Button onClick={() => handleOpenRatingsDialog(params.row)}>
                                View Ratings
                            </Button>
                        ),
                    },
                    {
                        field: 'actions',
                        headerName: 'Actions',
                        width: 150,
                        renderCell: (params) => (
                            <Button color="secondary" onClick={() => handleDeleteRow(params.row)}>Delete</Button>
                        )
                    }
                ]}
                pageSize={100}
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                pageSizeOptions={[5, 10, 25, 50, 100]}
                pagination
                getRowId={(row) => row.question_title}
            />
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="md">
                <DialogTitle>
                    <Typography variant="h6">Ratings for {selectedQuestion}</Typography>
                </DialogTitle>

                <DialogContent>
                    {currentRatings.map((rating, ratingIndex) => (
                        <Box key={ratingIndex} mb={2} borderBottom={1} pb={2}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={2}>
                                    <Typography variant="subtitle1">Mark: {rating.mark}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Select
                                        variant="outlined"
                                        fullWidth
                                        value={selectedFeedback[ratingIndex] || ''}
                                        onChange={(e) => handleFeedbackSelectChange(ratingIndex, e)}
                                    >
                                        {rating.feedbacks.map((feedback, feedbackIndex) => (
                                            <MenuItem
                                                key={feedbackIndex}
                                                value={feedback}
                                                onClick={(e) => handleFeedbackSelectChange(ratingIndex, e)}
                                            >
                                                {feedback}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        margin="dense"
                                        label="New Feedback"
                                        type="text"
                                        fullWidth
                                        value={newFeedbacks[ratingIndex] || ''}
                                        onChange={(e) => handleFeedbackChange(ratingIndex, e)}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <IconButton color="primary" onClick={() => handleAddFeedback(ratingIndex)}>
                                        <AddCircleOutlineIcon></AddCircleOutlineIcon>
                                    </IconButton>
                                    <IconButton color="secondary" onClick={() => handleRemoveFeedback(ratingIndex)}>
                                        <RemoveCircleOutlineIcon></RemoveCircleOutlineIcon>
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Box>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="primary" onClick={() => setDialogOpen(false)}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
}
