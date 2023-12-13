const express = require("express");
const classListController = require("../controllers/classListController");
const uploadMiddleware = require("../middlewares/uploadMiddleware");
const rubricController = require("../controllers/rubricController");

const router = express.Router();

router.post("/", classListController.uploadClassListData);
router.post("/upload", uploadMiddleware.single("jsonFile"), classListController.uploadClassListJsonFile);
router.get("/:id", classListController.getClassList);
router.put("/:id", classListController.updateClassList);


module.exports = router;
