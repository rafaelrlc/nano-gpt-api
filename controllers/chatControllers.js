const mongoose = require("mongoose");
const { initPostgres } = require("../init/postgres-client");
const { makeChain } = require("../scripts/makechain");

const previousConversations = require("../models/previousConversations");

const fetchQuery = async (req, res) => {
  const { question, temperature, token } = req.body;
  const { conversationId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    return res.status(400).json({ message: "Invalid conversationId" });
  }

  try {
    const sanitizedQuestion = question.trim().replaceAll("\n", " ");
    const conversation = await previousConversations.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    const formattedHistory = conversation.history.map((item) => [
      item.question,
      item.response,
    ]);

    const vectorStore = await initPostgres();

    const chain = makeChain(vectorStore, token, temperature);

    const response = await chain.call({
      question: sanitizedQuestion,
      chat_history: formattedHistory,
    });

    const response2 = await vectorStore.similaritySearch(sanitizedQuestion, 1);

    // update conversation history
    if (conversation) {
      conversation.history.push({
        question: question,
        response: response.text,
      });
      conversation.chatName = question.slice(0, 20);
      await conversation.save();
    }
    return res.status(200).json({
      question: question,
      response: response.text,
      response2: response2,
    });
  } catch (error) {
    console.log("error", error);
    return res
      .status(500)
      .json({ error: error.message || "Something went wrong" });
  }
};

const getConversation = async (req, res) => {
  const { conversationId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    return res.status(400).json({ message: "Invalid conversationId" });
  }

  try {
    const conversation = await previousConversations.findById(conversationId);
    if (!conversation) {
      console.log("131232112");
      return res.status(404).json({ error: "Conversation not found" });
    }
    const history = conversation.history;
    return res.status(200).json({ history });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getConversationsIds = async (req, res) => {
  try {
    const conversations = await previousConversations.find({}, "id chatName");
    return res.status(200).json(conversations);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const newConversation = async (req, res) => {
  try {
    const newConversation = new previousConversations();
    await newConversation.save();

    return res.status(200).json({
      message: "New conversation created successfully",
      conversationId: newConversation._id,
    });
  } catch (error) {
    console.log("error", error);
    return res
      .status(500)
      .json({ error: error.message || "Something went wrong" });
  }
};

// const deleteConversation = async () => {
//   const { conversationId } = req.params;
//   try {
//     await previousConversations.findByIdAndDelete(conversationId);
//   } catch (error) {
//     console.log("error", error);
//     throw new Error("Failed to delete conversation");
//   }
// };

const deleteAllConversation = async (req, res) => {
  try {
    await previousConversations.deleteMany({});
    return res
      .status(200)
      .json({ message: "All conversations deleted successfully" });
  } catch (error) {
    console.error("Error deleting conversations:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  fetchQuery,
  getConversation,
  getConversationsIds,
  newConversation,
  // deleteConversation,
  deleteAllConversation,
};
