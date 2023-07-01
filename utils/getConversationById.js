const previousConversations = require("../models/previousConversations");

const getConversationById = async (id) => {
  // retorna o historico
  try {
    const document = await previousConversations.findById(id);
    console.log("documentooo", document);
    return document;
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error;
  }
};

module.exports = { getConversationById };
