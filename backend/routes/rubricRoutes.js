const express = require("express");
const rubricController = require("../controllers/rubricController");
const uploadMiddleware = require("../middlewares/uploadMiddleware");

const router = express.Router();

// router.post("/", classListController.uploadClassListData);
router.post("/upload", uploadMiddleware.single("jsonFile"), rubricController.uploadRubricJsonFile);
router.get("/:id", rubricController.getRubric);

module.exports = router;                    