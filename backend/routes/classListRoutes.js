const express = require("express");
const classListController = require("../controllers/classListController");
const uploadMiddleware = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.post("/", classListController.uploadClassListData);
router.post("/upload", uploadMiddleware.single("jsonFile"), classListController.uploadClassListJsonFile);
router.get("/:id", classListController.getClassList);

module.exports = router;
