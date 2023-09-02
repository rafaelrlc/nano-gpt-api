require("dotenv").config();
const { TypeORMVectorStore } = require("langchain/vectorstores/typeorm");
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");

// if (
//   !process.env.POSTGRES_DATABASE ||
//   !process.env.POSTGRES_PASSWORD ||
//   !process.env.POSTGRES_USERNAME
// ) {
//   throw new Error("missing information on .env file");
// }

async function initPostgres() {
  try {
    const args = {
      postgresConnectionOptions: {
        type: "postgres",
        host: "localhost",
        username: "postgres",
        password: "4483Rr",
        database: "teste123",
      },
    };
    const typeormVectorStore = await TypeORMVectorStore.fromDataSource(
      new OpenAIEmbeddings(),
      args
    );

    return typeormVectorStore;
  } catch (error) {
    console.log(error + "erro ao conectar");
  }
}

module.exports = { initPostgres };
