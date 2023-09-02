const express = require("express");
const router = express.Router();

const {
  ingestFile,
  webscrapingHandler,
} = require("../../controllers/fileControllers");

router.post("/ingestFile", ingestFile);
router.post("/loadWebsite", webscrapingHandler);

module.exports = router;
