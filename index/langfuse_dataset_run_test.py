from langfuse import Langfuse
from llama_index.llms.openai import OpenAI
import llama_index.core
llama_index.core.set_global_handler("langfuse")
from llama_index.core.llms import ChatMessage

langfuse = Langfuse()
dataset = langfuse.get_dataset("term-extraction")
prompt = langfuse.get_prompt("extraction-prompt-1")

model = OpenAI(model="gpt-4-turbo-preview")
for item in dataset.items:
  compiled_prompt = prompt.compile(input=item.input)
  generation = langfuse.generation(prompt=prompt,model=model.model)
  messages = [
      ChatMessage(role="system", content="You are an API that must always respond with a json without any formatting."),
      ChatMessage(role="user", content=compiled_prompt),
  ]

  chat_completion = model.chat(messages)
  print(chat_completion)
  item.link(generation, "gpt-4-with-api-instructions")

  generation.end(output=chat_completion)
  
  # item.link(generation, "first-run-extraction")