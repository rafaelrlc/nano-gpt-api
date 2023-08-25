const express = require("express");
const router = express.Router();

const {
  askQuestion,
  getConversation,
  newConversation,
  getConversationsIds,
  deleteConversation,
  deleteAllConversation,
} = require("../../controllers/chatControllers");

router.post("/question/:conversationId", askQuestion);
router.get("/getConversation/:conversationId", getConversation);
router.post("/newConversation", newConversation);
router.get("/getConversationsIds", getConversationsIds);
router.delete("/deleteConversation/:conversationId", deleteConversation);
router.delete("/deleteAllConversation", deleteAllConversation);

module.exports = router;
