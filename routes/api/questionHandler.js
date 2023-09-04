const express = require("express");
const router = express.Router();
const validator = require("../../middlewares/joiValidator");

const { queryQuestionValidator } = require("../../utils/schemas");

const {
  fetchQuery,
  getConversation,
  newConversation,
  getConversationsIds,
  // deleteConversation,
  deleteAllConversation,
} = require("../../controllers/chatControllers");

router.post("/:conversationId", validator(queryQuestionValidator), fetchQuery);
router.get("/:conversationId", getConversation);
router.post("/conversation/new", newConversation);
router.get("/id/getAll", getConversationsIds);
// router.delete("/:conversationId", deleteConversation);
router.delete("/deleteAllConversation", deleteAllConversation);

module.exports = router;
