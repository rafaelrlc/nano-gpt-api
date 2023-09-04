const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MyTableSchema = new mongoose.Schema({
  id: {
    type: Schema.Types.ObjectId,
    required: true,
    auto: true,
  },
  chatName: String,
  history: [
    {
      question: String,
      response: String,
    },
  ],
});

module.exports = mongoose.model("PreviousConversations", MyTableSchema);
