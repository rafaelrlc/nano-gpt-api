const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { PineconeStore } = require("langchain/vectorstores/pinecone");
const { pinecone } = require("../utils/pinecone-client");

const { CSVLoader } = require("langchain/document_loaders/fs/csv");
const { DocxLoader } = require("langchain/document_loaders/fs/docx");
const { PDFLoader } = require("langchain/document_loaders/fs/pdf");

const { DirectoryLoader } = require("langchain/document_loaders/fs/directory");

if (!process.env.PINECONE_INDEX_NAME) {
  throw new Error("Missing Pinecone index name in .env file");
}

const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME ?? "";

const PINECONE_NAME_SPACE = "pdf-test";

const ingestManualData = async (data, type) => {
  try {
    const directoryLoader = new DirectoryLoader("docs", {
      ".pdf": (path) => new PDFLoader(path),
      ".csv": (path) => new CSVLoader(path),
      ".docx": (path) => new DocxLoader(path),
    });

    let docs = await directoryLoader.load();

    // IF PDF

    // const textSplitter = new RecursiveCharacterTextSplitter({
    //   chunkSize: 1000,
    //   chunkOverlap: 200,
    // });

    //const docs = await textSplitter.splitDocuments(rawDocs);
    //console.log("split docs", docs);

    console.log("criando vector store...");

    const embeddings = new OpenAIEmbeddings();

    const index = (await pinecone).Index(PINECONE_INDEX_NAME);
    //embed os documentos
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      namespace: PINECONE_NAME_SPACE,
      textKey: "text",
    });

    console.log("inserção completa");
  } catch (error) {
    console.log("error", error);
    throw new Error("Erro ao inserir dados");
  }
};

module.exports = { ingestManualData };
