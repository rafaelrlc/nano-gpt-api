const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { PineconeStore } = require("langchain/vectorstores/pinecone");
const { pinecone } = require("../utils/pinecone-client");

const { TypeORMVectorStore } = require("langchain/vectorstores/typeorm");
const { createConnection } = require("typeorm");

// LOADERS

const { DocxLoader } = require("langchain/document_loaders/fs/docx");
const { PDFLoader } = require("langchain/document_loaders/fs/pdf");
const { DirectoryLoader } = require("langchain/document_loaders/fs/directory");
const { JSONLoader } = require("langchain/document_loaders/fs/json");
const { TextLoader } = require("langchain/document_loaders/fs/text");
const { CSVLoader } = require("langchain/document_loaders/fs/csv");

const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");

if (!process.env.PINECONE_INDEX_NAME) {
  throw new Error("Missing Pinecone index name in .env file");
}
// } else if (!process.env.PINECONE_NAME_SPACE) {
//   throw new Error("Missing Pinecone name space in .env file");
// }

const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME ?? "";
const PINECONE_NAME_SPACE = process.env.PINECONE_NAME_SPACE ?? "";

const ingestData = async () => {
  const loader = new DirectoryLoader("docs", {
    ".json": (path) => new JSONLoader(path),
    ".txt": (path) => new TextLoader(path),
    ".csv": (path) => new CSVLoader(path),
    ".pdf": (path) => new PDFLoader(path),
    ".docx": (path) => new DocxLoader(path),
  });

  let rawDocs = await loader.load();
  console.log(rawDocs);

  const vectorStore = await TypeORMVectorStore.fromExistingIndex(
    new OpenAIEmbeddings(),
    {
      connection: await createConnection({
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "myuser",
        password: "ChangeMe",
        database: "api",
        entities: [], // Add your entity classes here
      }),
      tableName: "Document", // Replace with your table name
      vectorColumnName: "vector", // Replace with your vector column name
    }
  );

  await vectorStore.addDocuments(rawDocs);

  // try {
  //   console.log("criando vector store...");
  //   const embeddings = new OpenAIEmbeddings();

  //   const index = (await pinecone).Index(PINECONE_INDEX_NAME);

  //   //embedding
  //   await PineconeStore.fromDocuments(rawDocs, embeddings, {
  //     pineconeIndex: index,
  //     namespace: PINECONE_NAME_SPACE,
  //     textKey: "text",
  //   });
  // } catch (error) {
  //   console.log("error", error);
  //   throw new Error("Erro ao fazer embedding dos dados");
  // }
};

module.exports = { ingestData };
