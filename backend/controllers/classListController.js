const ClassListDataModel = require("../models/classListModel");
// const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
// const { PutCommand, DynamoDBDocumentClient, GetCommand  } = require("@aws-sdk/lib-dynamodb");
// const client = new DynamoDBClient({ region: "ap-southeast-2" })
// const docClient = DynamoDBDocumentClient.from(client);
// const dynamodbTableName = 'classList';
// const { v4: uuidv4 } = require('uuid')

const isValidJsonFormat = (data) => {
    if (!data || !data["class-list"] || !Array.isArray(data["class-list"])) {
        return false;
    }
    for (const item of data["class-list"]) {
        if (
            typeof item["Student ID"] !== "string" ||
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
        const jsonData = new ClassListDataModel({ "class-list": req.body["class-list"] });
        const savedFile = await jsonEntry.save();
        res.status(200).json({ message: "JSON file uploaded and data saved!", id: savedFile._id });
    } catch (error) {
        res.status(500).send(error);
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
        //DynamoDb
        // const params = {
        //     TableName: dynamodbTableName,
        //     Item: {
        //         'id': uuidv4(), // Provide a unique identifier for the item
        //         "class-list": jsonData["class-list"], // Convert the JSON to a string
        //     },
        // };
        // const command = new PutCommand(params);
        // const response = await docClient.send(command);
        // res.status(200).json({ message: "JSON file uploaded and data saved!", id: params.Item.id});

        //MongoDb
        const jsonEntry = new ClassListDataModel({ "class-list": jsonData["class-list"] });
        const savedFile = await jsonEntry.save();
        res.status(200).json({ message: "JSON file uploaded and data saved!", id: savedFile._id });
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.getClassList = async (req, res) => {
    try {
        //DynamoDb
        // const id = req.params.id;
        // const command = new GetCommand({
        //     TableName: dynamodbTableName,
        //     Key: {
        //         'id': id,
        //     },
        // });
        // const response = await docClient.send(command);
        // if (!response) {
        //     return res.status(404).send("Class List not found");
        // }
        // res.status(200).json(response.Item);

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
