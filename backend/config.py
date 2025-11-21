from mem0 import Memory
from dotenv import load_dotenv
import os

load_dotenv()

# memory database config
config = {
    "vector_store": {
        "provider": "pinecone",
        "config": {
            "collection_name": "mem0-agent",
            "embedding_model_dims": 1536, 
            "serverless_config": {
                "cloud": "aws",  
                "region": "us-east-1"
            },
            "metric": "cosine"
        }
    }
}

mem0 = None
try:
    mem0 = Memory.from_config(config)
    print("Mem0 client initialized successfully!")
except Exception as e:
    print(f"Failed to initialize Mem0: {e}")