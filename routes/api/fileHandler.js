const express = require("express");
const router = express.Router();

const {
  ingestManual,
  ingestData,
  ingestWebScraping,
} = require("../../controllers/fileControllers");

router.post("/ingestmanual", ingestManual);
router.post("/ingestData", ingestData);
router.post("/loadWebsite", ingestWebScraping);
module.exports = router;
