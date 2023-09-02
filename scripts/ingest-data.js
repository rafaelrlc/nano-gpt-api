const { DocxLoader } = require("langchain/document_loaders/fs/docx");
const { PDFLoader } = require("langchain/document_loaders/fs/pdf");
const { DirectoryLoader } = require("langchain/document_loaders/fs/directory");
const { JSONLoader } = require("langchain/document_loaders/fs/json");
const { TextLoader } = require("langchain/document_loaders/fs/text");
const { CSVLoader } = require("langchain/document_loaders/fs/csv");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { deleteAllFilesInDir } = require("../utils/dirFilesMethods");

const { initPostgres } = require("../init/postgres-client");

const ingestData = async () => {
  const loader = new DirectoryLoader("docs", {
    ".json": (path) => new JSONLoader(path),
    ".txt": (path) => new TextLoader(path),
    ".csv": (path) => new CSVLoader(path),
    ".pdf": (path) => new PDFLoader(path),
    ".docx": (path) => new DocxLoader(path),
  });

  let rawDocs = await loader.load();

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  rawDocs = await textSplitter.splitDocuments(rawDocs);

  try {
    const vectorStore = await initPostgres();
    await vectorStore.ensureTableInDatabase();
    await vectorStore.addDocuments(rawDocs);

    deleteAllFilesInDir("docs").then(() => {
      console.log("dados removidos apos embedding");
    });
  } catch (error) {
    console.log("deu erro");
    console.log(error);
  }
};

module.exports = { ingestData };
