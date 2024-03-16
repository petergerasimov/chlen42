import json
import os
from reference_parser import parse_references
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
    term_parts = link_terms(child['meta']['text'], terms_to_link)
    final_parts = []
    for part, link in term_parts:
      if link is None:
        references = parse_references(part)
        final_parts += references
        # print("case 1", references)
      else:
        final_parts.append((part, link))
        # print("case 2", (part, link))
    child['linked'] = final_parts
    process_children(child, level + 1)

with open(f"./similar.json") as f:
   similar = json.load(f)

for chlens in data:
  chlen = chlens[0]
  article_num = chlen['id']
  if os.path.exists(f'../terms-output/{article_num}.json'):
    with open(f'../terms-output/{article_num}.json', 'r') as f:
      terms = json.load(f)
      # print(terms)
      defined_terms += [(t.lower(), article_num) for t in terms['defined_terms']]
  else:
    print(f"chlen {article_num} not parsed yet")

for k, v in defined_terms.copy():
  # print(k, v)
  if k in similar:
    for s in similar[k]:
      defined_terms.append((s, v))
  else:
    print(f"{k} not found in similar")

used_terms = [t.lower() for t in terms['used_terms']]

# for k, v in defined_terms.copy():
#   print(k, v)

# for k, v in dict(defined_terms).items():
#   print(k)

for chlen in data:
  process_children(chlen[0])

# used_terms = list(set(used_terms))
# for k, v in dict(defined_terms).items():
#   all = [pair for pair in defined_terms if pair[0]== k]
#   if len(all) > 1:
#     print(all)

print(json.dumps(data, indent=2, ensure_ascii=False))


# json.dump({
#   "defined_terms": list(set([k for k,_ in defined_terms])),
#   "used_terms": list(set(used_terms))
# }, open("output.json", "w"), indent=2, ensure_ascii=False)