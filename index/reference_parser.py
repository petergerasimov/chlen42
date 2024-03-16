import re

def parse_references(input_text):
    results = []
    
    # Split input text into segments
    segments = re.split(r'((?:чл\. \d+[а-я]?|ал\. \d+|т\. \d+|,| и |\d+|\s+)+)', input_text)
    # segments = re.split(r'((?:чл\. \d+[а-я]?|ал\. \d+|т\. \d+|,|\d+|\s+)+)', input_text)
    # print(segments)
    for full_segment in segments:
        res = [r'чл\. (\d+[а-я]?)', r'ал\. (\d+)', r'т\. (\d+)']
        
        # if not at least one res match
        if not any(re.search(r, full_segment) for r in res):
            results += [(full_segment, None)]
            continue
        
        def recurse_segment(segment, idx=0, id='.', results=[], start=0, end=0):
            reg = res[idx]
            match = re.search(reg, segment)
            number_match = re.search(r'^[и,\s]+(\d+)', segment)
            full_text = full_segment[start:end]
            if match:
                # print(f"match reg[{reg}] segment[{segment}] full_text[{full_text}]")
                id += match.group(1)
                if idx < 2:
                    recurse_results = recurse_segment(segment[match.end():], idx + 1, id + '.', results, start, end + match.end())
                    # print(f"recurse_results {recurse_results}")
                    if len(recurse_results) == 0:
                        # print(f"pushing {((start, end), id, full_text)}")
                        return [*results, ((start, end + match.end()), id, full_text)]
                    return recurse_results
                else:
                    return [*results, ((start, end + match.end()), id, full_text)]
            elif number_match:
                my_id = '.'.join(id.split('.')[:-2]) + '.' + number_match.group(1) + '.'
                # print(f"number_match reg[{reg}] segment[{segment}] full_text[{full_text}] id[{id}] my_id[{my_id}] match[{number_match.group(1)}]")
                new_result = [*results, ((start, end), id, full_text)]
                rest = segment[number_match.end():]
                next_numbers = recurse_segment(rest, idx, my_id, results, start + len(full_text), end + number_match.end())
                # print(f"next_numbers {next_numbers}", ((start, end), my_id, full_text))
                new_result += next_numbers
                if len(next_numbers) == 0:
                    return [*new_result, ((end, end + len(segment)), my_id, "whatever")]
                return new_result
            else:
                if idx < 2:
                  try_results = recurse_segment(segment, idx + 1, id + '0.', results, start, end)
                  # print(f"try_results {try_results}")
                  return try_results
                return results
        
        subresult = recurse_segment(full_segment)
        # print(subresult)

        if len(subresult) == 0:
            results += [(full_segment, None)]
        else:
            results += [(full_segment[start:end], id) for (start, end), id, _ in subresult]

    # merge consecutive None
    merged_results = []
    for i, (text, id) in enumerate(results):
        if id is None and merged_results and merged_results[-1][1] is None:
            merged_results[-1] = (merged_results[-1][0] + text, None)
        else:
            merged_results.append((text, id))
    
    # remove trailing and leading .
    merged_results = [(text, None if id is None else id.strip('.')) for text, id in merged_results]

    return merged_results

text = "Текст с различни чл. 1 комбинации е чл. 15а, ал. 2 и 3 също така т. 1; чл. 22 нещо друго чл. 5, 6 и 7 опаля ал. 4, 5, 6 и 7 или ал., ал. 8 самостоятелно, ал. 5, т. 9, ал. без номер."
# parse_text(text)
# # print(parse_references(text))
# # expected output:
# # print([('Текст с различни'), ('чл. 1', '1'), (' комбинации е ', None), ('чл. 15а, ал. 2', '15а.2'), (' и ', None), ('3', '15а.3'), (' също така ', None), ('т. 1', '0.0.1'), ('; ', None), ('чл. 22', '22'), (' нещо друго ', None), ('чл. 5', '5'), (', ', None), ('6', '6'), (' и ', None), ('7', '7'), (' опаля ', None), ('ал. 4', '0.4'), (', ', None), ('5', '0.5'), (', ', None), ('6', '0.6'), (' и ', None), ('7', '0.7'), (' или ал., ', None), ('ал. 8', '0.8'), (' самостоятелно, ', None), ('ал 5, т. 9', '0.5.9'), (', ал. без номер.', None)])
