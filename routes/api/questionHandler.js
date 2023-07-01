const express = require("express");
const router = express.Router();

const {
  askQuestion,
  injestManualData,
  getConversation,
  newConversation,
  getAllConversations,
  deleteConversation,
} = require("../../controllers/chatControllers");

router.post("/question/:conversationId", askQuestion);
router.get("/getConversation/:conversationId", getConversation);
router.post("/newConversation", newConversation);
router.get("/ingestmanual", injestManualData);
router.get("getAllConversation", getAllConversations);
router.delete("deleteConversation/:conversationId", deleteConversation);

module.exports = router;
