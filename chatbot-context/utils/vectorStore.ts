import { QdrantVectorStore } from "langchain/vectorstores/qdrant";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

async function addDocumentsToVectorStore(docOutput: any,vectorStore :QdrantVectorStore) {
    const documentLimit=1000


    for(let i=0;i<docOutput.length;i=i+documentLimit){
    const docChunk=docOutput.slice(i,i+documentLimit)
    await vectorStore.addDocuments(docChunk);
    }
  }


  async function splitDocuments(docs:any) {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 20,
      });
  
      const docOutput = await splitter.splitDocuments(docs);
      return docOutput
  }
  
  export { addDocumentsToVectorStore ,splitDocuments};