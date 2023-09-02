const { OpenAI } = require("langchain/llms/openai");
const { ConversationalRetrievalQAChain } = require("langchain/chains");

const CONDENSE_PROMPT = `Dada a seguinte conversa e uma pergunta de acompanhamento, reformule a pergunta de acompanhamento para que seja uma pergunta independente.

Histórico da Conversa:

{chat_history}

Pergunta de Acompanhamento: {question}

Pergunta Independente:`;

const QA_PROMPT = `Você é um assistente de IA criado para fornecer informações úteis. Você foi incorporado a um grande conjunto de dados sobre esta empresa. Aqui estão as partes extraídas de um documento extenso e uma pergunta.

{context}

Pergunta: {question}

Resposta útil em markdown:`;

const makeChain = (vectorstore, token, temperature) => {
  const model = new OpenAI({
    temperature: 0.15,
    modelName: "gpt-3.5-turbo",
    maxTokens: 1000,
  });

  const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorstore.asRetriever(),
    {
      qaTemplate: QA_PROMPT,
      questionGeneratorTemplate: CONDENSE_PROMPT,
      returnSourceDocuments: false,
    }
  );
  return chain;
};

module.exports = { makeChain };
