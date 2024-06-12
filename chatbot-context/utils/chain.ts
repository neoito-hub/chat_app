import { OpenAI } from "langchain/llms/openai";
import { QdrantVectorStore } from "langchain/vectorstores/qdrant";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import {QdrantClient} from '@qdrant/js-client-rest';

import { formatDocumentsAsString } from "langchain/util/document";
import { StringOutputParser } from "langchain/schema/output_parser";
import { PromptTemplate } from "langchain/prompts"
import { RunnableSequence } from "langchain/schema/runnable";



const newOpenAiEmbeddings = new OpenAIEmbeddings({
  verbose: true,
  openAIApiKey: process.env.OPENAI_API_KEY,
});
const model = new OpenAI({});
const qdrantClient=new QdrantClient({url:process.env.QDRANT_URL });

function getVectorStore(collectionName: string): QdrantVectorStore {
  return new QdrantVectorStore(newOpenAiEmbeddings, {
    url: process.env.QDRANT_URL,
    collectionName: collectionName,
  });
}


function FormatChatHistory(
  human: string,
  ai: string,
  previousChatHistory?: string
){
  const newInteraction = `Human: ${human}\nAI: ${ai}`;
  if (!previousChatHistory) {
    return newInteraction;
  }
  return `${previousChatHistory}\n\n${newInteraction}`;
};


async function initChain(collectionName: string) {


  const retriever = getVectorStore(collectionName).asRetriever();

  // Create docs with a loader
  // const loader = new TextLoader("./utils/test_example.txt");

  /* create vectorstore*/

  /**
   * Create a prompt template for generating an answer based on context and
   * a question.
   *
   * Chat history will be an empty string if it's the first question.
   *
   * inputVariables: ["chatHistory", "context", "question"]
   */
  const questionPrompt = PromptTemplate.fromTemplate(
    `Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.
    ----------------
    CONTEXT: {context}
    ----------------
    CHAT HISTORY: {chatHistory}
    ----------------
    QUESTION: {question}
    ----------------
    Helpful Answer:`
  );

  return RunnableSequence.from([
    {
      question: (input: { question: string; chatHistory?: string }) =>
        input.question,
      chatHistory: (input: { question: string; chatHistory?: string }) =>
        input.chatHistory ?? "",
      context: async (input: { question: string; chatHistory?: string }) => {
        const relevantDocs = await retriever.getRelevantDocuments(
          input.question
        );
        const serialized = formatDocumentsAsString(relevantDocs);
        return serialized;
      },
    },
    questionPrompt,
    model,
    new StringOutputParser(),
  ]);
}


export { initChain, getVectorStore ,qdrantClient,FormatChatHistory};
