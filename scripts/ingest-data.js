const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { PineconeStore } = require("langchain/vectorstores/pinecone");
const { pinecone } = require("../utils/pinecone-client");

const { CSVLoader } = require("langchain/document_loaders/fs/csv");
const { DocxLoader } = require("langchain/document_loaders/fs/docx");
const { PDFLoader } = require("langchain/document_loaders/fs/pdf");

//

if (!process.env.PINECONE_INDEX_NAME) {
  throw new Error("Missing Pinecone index name in .env file");
}

const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME ?? "";

const PINECONE_NAME_SPACE = "fugroapi";

const filePath = "docs";

const ingestData = async (data, type) => {
  let loader = new CSVLoader(path);

  try {
    if (type == "csv") {
      loader = new CSVLoader(path);
    } else if (type == "pdf") {
      loader = new PDFLoader(path);
    } else if (type == "docx") {
      loader = new DocxLoader(path);
    }

    const rawDocs = await loader.load();

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    console.log("spliting docs", docs);

    const docs = await textSplitter.splitDocuments(rawDocs);

    console.log("creating vector store...");

    /*create and store the embeddings in the vectorStore*/
    const embeddings = new OpenAIEmbeddings();
    const index = await pinecone.Index(PINECONE_INDEX_NAME); //change to your own index name

    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      namespace: PINECONE_NAME_SPACE,
      textKey: "text",
    });
  } catch (error) {
    console.log("error", error);
    throw new Error("Failed to ingest your data");
  }
};

module.exports = { ingestData };
