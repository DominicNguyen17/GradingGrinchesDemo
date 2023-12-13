const express = require("express");
const downloadController = require("../controllers/downloadController");

const router = express.Router();
//
router.get("/exampleRubric", downloadController.downloadExampleRubric);
router.get("/exampleClassList", downloadController.downloadExampleClassList);
router.get("/marking/:id", downloadController.download);

module.exports = router;
