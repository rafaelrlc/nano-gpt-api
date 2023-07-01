const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MyTableSchema = new mongoose.Schema({
  id: {
    type: Schema.Types.ObjectId,
    required: true,
    auto: true,
  },
  history: {
    type: [[{ type: String }, { type: String }]],
    default: [],
  },
});

module.exports = mongoose.model("PreviousConversations", MyTableSchema);
