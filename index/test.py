text = "hello here is some text with some terms like"
terms_to_link = [("text", "example.com/text1"), ("some", "example.com/some")]

def link_terms(text, terms_to_link):
    import re
    terms_to_link = sorted(terms_to_link, key=lambda x: len(x[0]), reverse=True)
    pattern = '|'.join(re.escape(term) for term, _ in terms_to_link)
    parts = []
    last_end = 0
    for match in re.finditer(pattern, text):
        if last_end != match.start():
            parts.append((text[last_end:match.start()], None))
        parts.append((match.group(), dict(terms_to_link)[match.group()]))
        last_end = match.end()
    if last_end != len(text):
        parts.append((text[last_end:], None))
    return parts

result = link_terms(text, terms_to_link)
print(result)
