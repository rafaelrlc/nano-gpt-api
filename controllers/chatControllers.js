require("dotenv").config();

const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { PineconeStore } = require("langchain/vectorstores/pinecone");
const { ingestManualData } = require("../scripts/ingest-manual-data");

const { makeChain } = require("../utils/makechain");
const { pinecone } = require("../utils/pinecone-client");

const { getConversationById } = require("../utils/getConversationById");
const previousConversations = require("../models/previousConversations");

const getConversation = async (req, res) => {
  const { conversationId } = req.params;
  const conversation = await getConversationById(conversationId);
  const history = conversation.history;
  res.status(200).json({ history });
};

const getAllConversations = async () => {
  try {
    const conversations = await previousConversations.find();
    res.status(200).json({ conversations });
  } catch (error) {
    console.log("error", error);
    throw new Error("Failed to retrieve conversations");
  }
};

const newConversation = async (req, res) => {
  try {
    const newConversation = new previousConversations();
    await newConversation.save();

    res.status(200).json({
      message: "New conversation created successfully",
      conversationId: newConversation._id,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
};

const deleteConversation = async () => {
  const { conversationId } = req.params;
  try {
    await previousConversations.findByIdAndDelete(conversationId);
  } catch (error) {
    console.log("error", error);
    throw new Error("Failed to delete conversation");
  }
};

const askQuestion = async (req, res) => {
  if (!process.env.PINECONE_INDEX_NAME) {
    throw new Error("Missing Pinecone index name in .env file");
  }

  const PINECONE_INDEX_NAME = "testembedding";

  const PINECONE_NAME_SPACE = "pdf-test"; //fugroapi

  const { question } = req.body; // vai puxar o history do mongo

  const { conversationId } = req.params;

  if (!question) {
    return res.status(400).json({ message: "question missing" });
  }
  const sanitizedQuestion = question.trim().replaceAll("\n", " ");

  try {
    const conversation = await getConversationById(conversationId);
    const history = conversation ? conversation.history : [];

    const index = (await pinecone).Index(PINECONE_INDEX_NAME);

    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({}),
      {
        pineconeIndex: index,
        textKey: "text",
        namespace: PINECONE_NAME_SPACE,
      }
    );

    const chain = makeChain(vectorStore);

    const response = await chain.call({
      question: sanitizedQuestion,
      chat_history: history || [],
    });

    // update conversation history
    if (conversation) {
      conversation.history.push([question, response.text]);
      await conversation.save();
    }

    res.status(200).json({ question: question, response: response.text });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
};

const injestManualData = async (req, res) => {
  await ingestManualData();
  return res.sendStatus(200);
};

// const insertNewData = (req, res) => {
//   const fileBuffer = req.file.buffer;

//   const fileType = require("file-type");

//   const type = fileType(fileBuffer);

//   if (!type) {
//     return res.status(400).send("Unknown file type");
//   }

//   console.log(`Tipo de dado: ${type.ext}`);

//   switch (type.ext) {
//     case "csv":
//       break;
//     case "pdf":
//       break;
//     case "1x":
//       break;
//     default:
//       return res.status(400).send("Unsupported file type");
//   }
// };

module.exports = {
  askQuestion,
  injestManualData,
  getConversation,
  getAllConversations,
  newConversation,
  deleteConversation,
};
