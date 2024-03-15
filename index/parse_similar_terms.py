import json
import os
from llama_index.core.llms import ChatMessage

data = json.load(open("../ui/chlen42/public/parsed.json", "r"))

def get_children(obj):
  if 'alineas' in obj:
    return obj['alineas']
  elif 'points' in obj:
    return obj['points']
  elif 'letters' in obj:
    return obj['letters']
  else:
    return []

def link_terms(text, terms_to_link):
    import re
    terms_to_link = sorted(terms_to_link, key=lambda x: len(x[0]), reverse=True)
    pattern = '|'.join(re.escape(term) for term, _ in terms_to_link)
    parts = []
    last_end = 0
    for match in re.finditer(pattern, text, re.IGNORECASE):
        if last_end != match.start():
            parts.append((text[last_end:match.start()], None))
        parts.append((match.group(), dict(terms_to_link)[match.group().lower()]))
        last_end = match.end()
    if last_end != len(text):
        parts.append((text[last_end:], None))
    return parts

used_terms = []
defined_terms = []

def process_children(item, level=0):
  children = get_children(item)
  for child in children:
    terms_to_link = defined_terms # + [(t, "UNKNOWN") for t in used_terms]
    # print(terms_to_link)
    child['linked'] = link_terms(child['text'], terms_to_link)
    # print(child['linked'])
    process_children(child, level + 1)

for chlens in data:
  chlen = chlens[0]
  article_num = chlen['id']
  if os.path.exists(f'../terms-output/{article_num}.json'):
    with open(f'../terms-output/{article_num}.json', 'r') as f:
      terms = json.load(f)
      # process_children(chlen)
      # print(terms)
      defined_terms += [(t.lower(), article_num) for t in  terms['defined_terms']]
      used_terms += [t.lower() for t in terms['used_terms']]
  else:
    print(f"chlen {article_num} not parsed yet")
    
defined_terms = list(set([k for k,_ in defined_terms]))
used_terms = list(set(used_terms))

# chunk used_terms in 100 terms
chunks = [used_terms[x:x+100] for x in range(0, len(used_terms), 100)]
for chunk in chunks:
  prompt = (
     f"Here is a list of defined terms:\n"
     f"{json.dumps(defined_terms)}\n"
     f"Here is a list of used terms:\n"
     f"{json.dumps(chunk)}\n"
     f"Please reply with a json that has for keys the defined terms, and for values an array of used terms that are rephrases of the defined term. "
     f"Used terms that are not rephrases of any defined term, should be ignored and not included in the resulting json."
  )
  messages = [
    ChatMessage(role="system", content="You are an API that must always respond with a json without any formatting."),
    ChatMessage(role="user", content=prompt),
  ]

  
  