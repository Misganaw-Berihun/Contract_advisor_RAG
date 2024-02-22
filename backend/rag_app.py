import logging
import os 
import tempfile

from langchain.chains import ConversationalRetrievalChain
from langchain.chains.base import Chain
from langchain.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Qdrant
from langchain.schema import BaseRetriever, Document
from dotenv import load_dotenv

from scripts.utils import MEMORY, load_document
logging.basicConfig(encoding="utf-8", level=logging.INFO)
LOGGER = logging.getLogger()

load_dotenv()
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')

LLM = ChatOpenAI(
    model_name="gpt-3.5-turbo", temperature=0, streaming=True
)

def configure_retriever(
    docs: list[Document]
) -> BaseRetriver:
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1500, chunk_overlap=200)
    splits = text_splitter.split_documents(docs)

    embeddings = OpenAIEmbeddings()

    vectordb = Qdrant.from_documents(
        docs, 
        embeddings,
        path='new_embeding',
        collection_name="contract_documents",
        force_recreate=True,    
    )
    
    retriever = vectordb.as_retriever (
        search_type = "mmr", search_kwargs={
            "k": 5,
            "fetch_k": 7,
            "include_metadata": True
        },
    )

    return retriever

def configure_chain(retriever: BaseRetriever) -> Chain:
    params = dict(
        llm=LLM,
        retriever=retriver,
        memory=MEMORY,
        verbose=True,
        max_tokens_limit=4000,
    )

    return ConversationalRetrievalChain.from_llm(
        **params
    )

def configure_retrieval_chain(
    docs
) -> Chain:
     
     retriever = configure_retriever(docs=docs)
     chain = configure_chain(retriever=retriever)
     return chain