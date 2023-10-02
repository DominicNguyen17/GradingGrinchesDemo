const RubricModel = require("../models/rubricModel");
// const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
// const { PutCommand, DynamoDBDocumentClient, GetCommand  } = require("@aws-sdk/lib-dynamodb");
// const client = new DynamoDBClient({ region: "ap-southeast-2" })
// const docClient = DynamoDBDocumentClient.from(client);
// const dynamodbTableName = 'Rubric';
// const { v4: uuidv4 } = require('uuid')

const isValidJsonFormat = (data) => {
    if (!data || !data["assignment title"] || !data["owner"] || !data["rubric"] || !Array.isArray(data["rubric"])) {
        return false;
    }
    for (const item of data["rubric"]) {
        if (
            typeof item["question_title"] !== "string" ||
            typeof item["marks"] !== "number" ||
            typeof item["marker comments"] !== "string"
            // Todo - add check for feedbacks
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


exports.uploadRubricJsonFile = async (req, res) => {
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
        const jsonEntry = new RubricModel({ "owner": jsonData["owner"], "assignment title": jsonData["assignment title"], "rubric": jsonData["rubric"] });
        const savedFile = await jsonEntry.save();
        res.status(200).json({ message: "JSON file uploaded and data saved!", id: savedFile._id });
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.getRubric = async (req, res) => {
    try {
        const id = req.params.id;
        const rubric = await RubricModel.findById(id);
        if (!rubric) {
            return res.status(404).send("Rubric not found");
        }
        res.status(200).json(rubric);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}


exports.updateRubric = async (req, res) => {
    const id = req.params.id;
    const updatedRubric = req.body;

    console.log(updatedRubric);

    try {
        const rubric = await RubricModel.findById(id);
        if (!rubric) {
            return res.status(404).send("Rubric not found");
        }

        // update rubric
        rubric.set(updatedRubric);
        const savedRubric = await rubric.save();
        console.log(savedRubric);
        res.status(200).json(savedRubric);

    } catch (error) {
        console.log(error.message)
        res.status(500).send("Internal Server Error");
    }
};