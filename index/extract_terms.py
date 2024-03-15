from langfuse import Langfuse
from llama_index.llms.openai import OpenAI
import llama_index.core
llama_index.core.set_global_handler("langfuse")
from llama_index.core.llms import ChatMessage
import json
from json_repair import repair_json
import os

langfuse = Langfuse()
prompt = langfuse.get_prompt("extraction-prompt-1")


with open("../data.json", "r") as f:
    input_text = f.read()
    data = json.loads(input_text)


model = OpenAI(model="gpt-4-turbo-preview")
# model = OpenAI()
for chlen in data:
  # skip if file exists
  if os.path.exists(f'../terms-output/{chlen["article_num"]}.json'):
    print(f"chlen {chlen['article_num']} already exists")
    continue

  try:
    compiled_prompt = prompt.compile(input=chlen['text'])
    generation = langfuse.generation(input=chlen['text'], prompt=prompt,model=model.model)
    messages = [
        ChatMessage(role="system", content="You are an API that must always respond with a json without any formatting."),
        ChatMessage(role="user", content=compiled_prompt),
    ]

    chat_completion = model.chat(messages)
    with open(f'../terms-output/{chlen["article_num"]}.json', 'w') as f:
       f.write(json.dumps(json.loads(repair_json(chat_completion.message.content)), ensure_ascii=False))

    generation.end(output=chat_completion)
    print(f"chlen {chlen['article_num']} completed")
  except Exception as e:
     print(f"chlen {chlen['article_num']} failed with error: {e}")