# read json from data.json

import json
import os
from llm_parse import llm_parse
from manual_parse import manual_parse


with open("../data.json", "r") as f:
    input_text = f.read()
    data = json.loads(input_text)

parsed = []
for item in data:
    article_num = item["article_num"]
    text = item["text"]
    manual_parsed = manual_parse(text)
    parsed.append(manual_parsed)
    # with open(f"../parsed/{article_num}_manual.json", "w") as f:
    #     f.write(json.dumps(manual_parsed, indent=2, ensure_ascii=False))
    # llm_parsed = llm_parse(text)
    # with open(f"../parsed/{article_num}_llm.json", "w") as f:
    #     f.write(llm_parsed)
  
with open(f"../parsed.json", "w") as f:
    f.write(json.dumps(parsed, indent=2, ensure_ascii=False))