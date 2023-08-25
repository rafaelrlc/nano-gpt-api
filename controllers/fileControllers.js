const { ingestManualData } = require("../scripts/ingest-manual-data");

const ingestManual = async (req, res) => {
  await ingestManualData();
  return res.sendStatus(200);
};

const ingestData = async (req, res) => {
  return 0;
};

const ingestWebScraping = async (req, res) => {
  const { websiteURL } = req.body;

  if (!websiteURL) {
    return res.status(400).json({ message: "question missing" });
  }
};

module.exports = {
  ingestManual,
  ingestData,
  ingestWebScraping,
};
