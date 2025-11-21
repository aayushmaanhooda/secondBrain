from langchain.messages import HumanMessage, AIMessage, SystemMessage
from langchain.chat_models import init_chat_model
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from config import mem0
from typing import Annotated, TypedDict, List
from dotenv import load_dotenv

load_dotenv()

# chat model
llm = init_chat_model("gpt-4o")

class ChatState(TypedDict):
    messages: Annotated[List[HumanMessage | AIMessage], add_messages]
    mem0_user_id: str

graph = StateGraph(ChatState)

def chatbot(state: ChatState):
    messages = state["messages"]
    user_id = state["mem0_user_id"]

    current_message = messages[-1].content

    try:
        # Retrieve relevant memories
        memories = mem0.search(current_message, user_id=user_id)

        # Handle dict response format
        memory_list = memories["results"]

        context = "Relevant information from previous conversations:\n"
        for memory in memory_list:
            context += f"- {memory["memory"]}\n"
        
        system_message = SystemMessage(
            content=f"""You are a helpful customer support assistant. 
            Use the provided context to personalize your responses and remember user preferences and past interactions.\n
            {context}"""
        )

        full_message = [system_message] + messages

        response = llm.invoke(full_message)
        try:
            interaction = [
                {
                    "role": "user",
                    "content": messages[-1].content
                },
                {
                    "role": "assistant", 
                    "content": response.content
                }
            ]
            result = mem0.add(interaction, user_id=user_id)
            print(f"Memory saved: {len(result.get('results', []))} memories added")
        except Exception as e:
            print(f"Error saving memory: {e}")
        
        return {"messages": [response]}
        
    except Exception as e:
        print(f"Error in chatbot: {e}")
        # Fallback response without memory context
        response = llm.invoke(messages)
        return {"messages": [response]}


graph.add_node("chatbot", chatbot)
graph.add_edge(START, "chatbot")
graph.add_edge("chatbot", END)

compiled_graph = graph.compile()


def run_conversation(user_input: str, mem0_user_id:str):
    config = {
        "configurable": {"thread_id": mem0_user_id}
    }
    current_state = {"messages": [HumanMessage(content=user_input)], "mem0_user_id": mem0_user_id}

    response_content = ""
    for event in compiled_graph.stream(current_state, config):
        for value in event.values():
            if value.get("messages"):
                response_content = value["messages"][-1].content
                
    return response_content