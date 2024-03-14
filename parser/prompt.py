import os
import json
from typing import TypedDict, List, Optional

class AlineaPoint(TypedDict):
    id: str
    text: str

class Alinea(TypedDict, total=False):
    id: str
    text: str
    points: List[AlineaPoint]

class TextAmendment(TypedDict):
    id: str
    text: str
    alineas: List[Alinea]

Articles = List[TextAmendment]

examples_dir = "../prompting/examples/"
examples = ""
for example in os.listdir(examples_dir):
    with open(f'{examples_dir}{example}/input.txt', 'r') as f:
        input_text = f.read()
    with open(f'{examples_dir}{example}/output.json', 'r') as f:
        output_json : Articles = json.load(f)

    # for amendment in output_json:
    #     if amendment["text"] is not None:
    #       amendment["start"] = amendment["text"][0:50]
    #       amendment["end"] = amendment["text"][-50:]
    #     del amendment["text"]
    #     for alinea in amendment['alineas']:
    #         if alinea["text"] is not None:
    #           alinea["start"] = alinea["text"][0:50]
    #           alinea["end"] = alinea["text"][-50:]
    #         del alinea["text"]
    #         for point in alinea.get('points', []):
    #             if point["text"] is not None:
    #               point["start"] = point["text"][0:50]
    #               point["end"] = point["text"][-50:]
    #             del point["text"]
    examples += (
        f"Example input:\n"
        f"{input_text}\n"
        f"Example output:\n"
        f"{json.dumps(output_json, ensure_ascii=False, indent=2)}\n"
    )

prompt = f"""
The structure of Bulgarian acts is the following (in that hierarchical order):

Term: Член
Numbering: Чл. 1., Чл 1а., Чл 2.

Term: Алинея
Numbering: (1), (2), (3)

Term: Точка
Example numbering: 1., 2., 3.

Term: Буква
Numbering: а), б), в), г), д)

The input will be a legal act in Bulgarian, it will strictly follow this hierarchical order.
Your reply needs to be a JSON document that describes the document.
Imporant: If Чл. N. is immediately followed by (1), then its text will be empty ("").
The input will always contain only one Член and the output will be an array of a single element.

Here are some examples:

{examples}

Input:
$INPUT$

Reply with the output JSON.
"""

def get_prompt(input_text):
    return prompt.replace('$INPUT$', input_text)