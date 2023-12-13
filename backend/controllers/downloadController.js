const ClassListDataModel = require("../models/classListModel");
const fs = require('fs');
const path = require('path');

function convert(jsonData) {
    return jsonData['class-list'].map(student => {
        const {
            'Student UPI': studentUpi,
            'Student Name': studentName,
            'Class ID': classId,
            'Assignment ID': assignmentId,
            'Mark Status': markStatus,
            'Marks': marks
        } = student;

        return {
            studentUpi,
            studentName,
            classId,
            assignmentId,
            markStatus,
            marks: marks.map(mark => {
                const {
                    question_title,
                    mark: originalMark,
                    feedback: originalFeedback,
                    customMark,
                    customFeedback
                } = mark;

                return {
                    question_title,
                    mark: customMark !== null ? customMark : originalMark,
                    feedback: customFeedback !== null ? customFeedback : originalFeedback
                };
            })
        };
    });
}

function convertToCSV(jsonData) {
    const rows = [];

    // Headers
    const headers = [
        "Student UPI",
        "Student Name",
        "Class ID",
        "Assignment ID",
        "Mark Status",
        "Question Title",
        "Mark",
        "Feedback",
    ];
    rows.push(headers.join(','));

    // Data
    jsonData['class-list'].forEach(student => {
        const {
            "Student UPI": studentUpi,
            "Student Name": studentName,
            "Class ID": classId,
            "Assignment ID": assignmentId,
            "Mark Status": markStatus,
            "Marks": marks
        } = student;

        if (marks && marks.length > 0) {
            marks.forEach(mark => {
                const finalMark = mark["customMark"] !== null ? mark["customMark"] : mark["mark"];
                const finalFeedback = mark["customFeedback"] !== null ? mark["customFeedback"] : mark["feedback"];
                const row = [
                    studentUpi,
                    studentName,
                    classId,
                    assignmentId,
                    markStatus,
                    mark["question_title"],
                    finalMark,
                    finalFeedback,
                ].map(val => (val === null || val === undefined) ? '' : `"${val.toString().replace(/"/g, '""')}"`).join(',');
                rows.push(row);
            });
        } else {
            const row = [
                studentUpi,
                studentName,
                classId,
                assignmentId,
                markStatus,
                '',
                '',
                '',
            ].map(val => (val === null || val === undefined) ? '' : `"${val.toString().replace(/"/g, '""')}"`).join(',');
            rows.push(row);
        }
    });

    return rows.join('\n');
}



exports.download = async (req, res) => {
    try {
        const format = req.query.format; // Extract the format query parameter
        const classListData = await ClassListDataModel.findById(req.params.id);
        if (!classListData) {
            return res.status(404).send("File not found.");
        }

        // Convert data to a string based on the requested format
        let data;
        if (format === '.csv') {
            // Convert classListData to CSV format
            data = convertToCSV(classListData);
        } else {
            // Convert classListData to JSON format
            data = JSON.stringify(convert(classListData), null, 2);
        }

        // Create a temporary file
        const tempFilePath = path.join(__dirname, `temp${format}`);
        fs.writeFileSync(tempFilePath, data);

        // Send the file
        res.download(tempFilePath, `data${format}`, (err) => {
            if (err) {
                res.status(500).send('Internal Server Error, please try again later');
            } else {
                // Delete the temporary file
                fs.unlinkSync(tempFilePath);
            }
        });
    } catch (error) {
        res.status(500).send('Internal Server Error, please try again later');
    }
};

exports.downloadExampleRubric = async (req, res) => {
    // file in the sample rubric folder
    const filePath = path.join(__dirname, '../sample/rubric.json');
    res.download(filePath, 'rubric.json', (err) => {
        if (err) {
            res.status(500).send('Internal Server Error, please try again later');
        }
    });
}

exports.downloadExampleClassList = async (req, res) => {
    const filePath = path.join(__dirname, '../sample/class-list.json');
    console.log(filePath);
    res.download(filePath, 'class-list.json', (err) => {
        if (err) {
            res.status(500).send('Internal Server Error, please try again later');
        }
    });
}