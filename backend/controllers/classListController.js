const ClassListDataModel = require("../models/classListModel");

const isValidJsonFormat = (data) => {
    if (!data || !data["class-list"] || !Array.isArray(data["class-list"])) {
        return false;
    }
    for (const item of data["class-list"]) {
        if (
            typeof item["Student UPI"] !== "string" ||
            typeof item["Student Name"] !== "string" ||
            typeof item["Class ID"] !== "string" ||
            typeof item["Assignment ID"] !== "string"
        ) {
            return false;
        }
    }
    return true;
};

const isFileValid = (file) => {
    if (!file) {
        return false;
    }
    const fileExtension = file.originalname.split(".").pop();
    return fileExtension === "json";
}


exports.uploadClassListData = async (req, res) => {
    // file must exist and be a json file
    if (!isFileValid(req.file)) {
        return res.status(400).send("Invalid file format.");
    }

    if (!isValidJsonFormat(req.body)) {
        return res.status(400).send("Invalid JSON format.");
    }

    try {
        const classListJsonData = new ClassListDataModel({ "class-list": req.body["class-list"] });
        const savedFile = await classListJsonData.save();

        res.status(200).json(savedFile);
    } catch (error) {
        res.status(500).send('Internal Server Error, please try again later');
    }
};

exports.uploadClassListJsonFile = async (req, res) => {
    // file must exist and be a json file
    if (!isFileValid(req.file)) {
        return res.status(400).send("Invalid file format.");
    }

    const fileBuffer = req.file.buffer;
    const jsonData = JSON.parse(fileBuffer.toString());

    if (!isValidJsonFormat(jsonData)) {
        return res.status(400).send("Invalid JSON format.");
    }

    try {
        //MongoDb
        const jsonEntry = new ClassListDataModel({ "class-list": jsonData["class-list"] });
        const savedFile = await jsonEntry.save();
        res.status(200).json(savedFile);
    } catch (error) {
        res.status(500).send('Internal Server Error, please try again later');
    }
};

exports.getClassList = async (req, res) => {
    try {
        //MongoDb
        const id = req.params.id;
        const classList = await ClassListDataModel.findById(id);
        if (!classList) {
            return res.status(404).send("Class List not found");
        }
        res.status(200).json(classList);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}

exports.updateClassList = async (req, res) => {
    const id = req.params.id;
    const updatedClassList = req.body;
    console.log(updatedClassList)
    console.log(id);
    try {
        const classList = await ClassListDataModel.findById(id);
        if (!classList) {
            return res.status(404).send("Class List not found");
        }

        // update class list
        classList.set(updatedClassList);
        const savedClassList = await classList.save();
        res.status(200).json(savedClassList);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}