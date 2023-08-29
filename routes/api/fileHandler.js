const express = require("express");
const router = express.Router();

const {
  ingestManual,
  ingestFile,
  ingestWebScraping,
} = require("../../controllers/fileControllers");

router.post("/ingestmanual", ingestManual);
router.post("/ingestFile", ingestFile);

//router.post("/loadWebsite", webscrapingHandler);

module.exports = router;
