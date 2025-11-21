from pinecone import Pinecone
import os

pc = Pinecone()
index_name = "mem0-agent"
index = pc.Index(index_name)


def check_user_exist(user_id:str):
    # Query with filter
    dummy_vector = [0.0] * 1536 
    results = index.query(
        vector=dummy_vector,
        filter={"user_id": user_id},
        top_k=1,
        include_metadata=True
    )
    if not results.matches:
        return None
    user_id = results.matches[0]["metadata"]["user_id"]
    return user_id
