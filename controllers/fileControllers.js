const { ingestData } = require("../scripts/ingest-data");

const ingestFile = async (req, res) => {
  ingestData();
  return res.status(200).json({ message: "Documents Uploaded" });
};

const webscrapingHandler = async (req, res) => {
  const { websiteURL } = req.body;

  if (!websiteURL) {
    return res.status(400).json({ message: "question missing" });
  }
  // passar url como parametro
};

module.exports = {
  ingestFile,
  webscrapingHandler,
};
