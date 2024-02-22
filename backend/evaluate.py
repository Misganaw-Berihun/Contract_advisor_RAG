import nest_asyncio
import os
import openai
from dotenv import load_dotenv
from rag_app import configure_retrieval_chain
import pandas as pd

load_dotenv()
api_key = os.environ.get("OPENAI_API_KEY")
openai.api_key = api_key
nest_asyncio.apply()

def load_data(qna):
    eval_questions = qna['Questions'].tolist()
    eval_answers = qna['Answers'].tolist()

    examples = [
        {"query": q, "ground_truths": [eval_answers[i]]}
        for i, q in enumerate(eval_questions)
    ]

    return examples

def evaluate_chain(examples, chain):
    predictions = chain.batch(examples)
    return predictions

def evaluate_metrics(examples, predictions):
    faithfulness_chain = RagasEvaluatorChain(metric=faithfulness)
    answer_rel_chain = RagasEvaluatorChain(metric=answer_relevancy)
    context_rel_chain = RagasEvaluatorChain(metric=context_precision)
    context_recall_chain = RagasEvaluatorChain(metric=context_recall)

    faithfulness_score = faithfulness_chain.evaluate(examples, predictions)
    answer_relevancy_score = answer_rel_chain.evaluate(examples, predictions)
    context_precision_score = context_rel_chain.evaluate(examples, predictions)
    context_recall_score = context_recall_chain.evaluate(examples, predictions)

    return faithfulness_score, answer_relevancy_score, context_precision_score, context_recall_score

def create_dataframe(qna, faithfulness_scores, answer_relevancy_scores, context_precision_scores, context_recall_scores):
    df = pd.DataFrame({
        "Faithfulness Score": faithfulness_scores,
        "Answer Relevancy Score": answer_relevancy_scores,
        "Context Precision Score": context_precision_scores,
        "Context Recall Score": context_recall_scores
    })

    result_df = pd.concat([qna, df], axis=1)
    return result_df

def main():
    chain = configure_chain()

    qna = pd.read_csv('your_qna_file.csv')
    examples = load_data(qna)

    predictions = evaluate_chain(examples, chain)

    faithfulness_score, answer_relevancy_score, context_precision_score, context_recall_score = evaluate_metrics(examples, predictions)

    result_df = create_dataframe(qna, faithfulness_score, answer_relevancy_score, context_precision_score, context_recall_score)
    return result_df

if __name__ == "__main__":
    result_dataframe = main()
    print(result_dataframe)
