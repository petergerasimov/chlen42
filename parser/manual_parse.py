import re
import json

import re
from typing import List, Dict, Any

import re
from typing import List, Dict, Any

import re
from typing import List, Dict, Any

def find_text_and_subsections(document: str, pattern: re.Pattern):
    matches_list = []
    text = None
    last_end = 0
    for match in pattern.finditer(document):
        # print({"DOC": document, "PATTERN": pattern, "TEXT": text})
        # print(f"Match: [{match.group(1)}] [{match.group(2)}]")
        if text is None:
            text = document[last_end:match.start()].strip()
            # print(f"TEXT: {text}")
        else:
            assert document[last_end:match.start()] == "", f"Expected empty string, got '{document[last_end:match.start()]}'. More context: ...{document[max(0, match.start()-10):match.start()]}..."
        section_data = {"id":  match.group(1), "full_text": match.group(2)}
        matches_list.append(section_data)
        last_end = match.end()
    # assert last_end == len(document), f"Expected {len(document)}, got {last_end}, document: {document}"
    if text is None:
        text = document.strip()

    return (text, matches_list)

def get_meta(text):
    dv_pattern = re.compile(r"^\(([^()]*ДВ[^()]*)\)")
    dv_match = dv_pattern.search(text)
    if dv_match:
        return {
            "dv": dv_match.group(1),
            "text": text.replace(dv_match.group(0), "").strip()
        }
    else:
        return {
            "dv": None,
            "text": text
        }

def manual_parse(document: str) -> List[Dict[str, Any]]:
    pattern_article = re.compile(r"Чл\. (\d+[а-я]?)[.](.*?)\s*(?=Чл\. |\Z)", re.DOTALL)
    pattern_alinea = re.compile(r"\((\d+)\)\s*(.*?)\s*(?=\(\d+\)\s|\Z)", re.DOTALL)
    pattern_point = re.compile(r"\n(\d+)\.\s*(.*?)\s*(?=\n\d+\.|\Z)", re.DOTALL)
    pattern_letter = re.compile(r"\n([а-я])\)\s*(.*?)\s*(?=\n[а-я]\)|\Z)", re.DOTALL)

    # Parse articles
    (title, articles) = find_text_and_subsections(document, pattern_article)
    for article in articles:
        (text, alineas) = find_text_and_subsections(article["full_text"], pattern_alinea)
        article["text"] = text
        article["alineas"] = alineas
        article["meta"] = get_meta(text)
        del article["full_text"]
        for alinea in alineas:
            (text, points) = find_text_and_subsections(alinea["full_text"], pattern_point)
            alinea["text"] = text
            alinea["points"] = points
            alinea["meta"] = get_meta(text)
            del alinea["full_text"]
            for point in points:
                (text, letters) = find_text_and_subsections(point["full_text"], pattern_letter)
                point["text"] = text
                point["letters"] = letters
                point["meta"] = get_meta(text)
                del point["full_text"]
    return articles

# with open("../prompting/test/testcase.txt", "r") as f:
#     input_text = f.read()

# document = parse_legal_document(input_text)
# print(json.dumps(document, ensure_ascii=False, indent=2))