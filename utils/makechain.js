const { OpenAI } = require("langchain/llms/openai");
const { ConversationalRetrievalQAChain } = require("langchain/chains");

const CONDENSE_PROMPT = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:

{chat_history}

Follow Up Input: {question}

Standalone question:`;

const QA_PROMPT_FUGRO = `You are an AI assistant made to provide helpful advice about the Company called "Fugro", you were embedded with a large dataset about this company. You are given the following extracted parts of a long document and a question.

{context}

Question: {question}

Helpful answer in markdown:`;

const makeChain = (vectorstore, temp, token) => {
  console.log("debugg", temp, token);

  const model = new OpenAI({
    temperature: 0,
    modelName: "gpt-3.5-turbo",
    maxTokens: token,
  });

  const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorstore.asRetriever(),
    {
      qaTemplate: QA_PROMPT_FUGRO,
      questionGeneratorTemplate: CONDENSE_PROMPT,
      returnSourceDocuments: false,
    }
  );
  return chain;
};

module.exports = { makeChain };
