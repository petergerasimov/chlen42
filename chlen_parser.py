import os
import re

def parse_line(line : str):
    num, text = line.split(' ', 1)

    return create_data_node(text, None)

def create_data_node(text: str, release_info):
    return {
        'data': text,
        'release_info': release_info
    }

def parse_article(text : str):
    lines = text.split('\n')
    #print(text)
    article_num = re.search('Чл\\. (\d+)\\. (.*)', lines[0])
    print(article_num.group(1))

    article = {
        'text': article_num.group(1),
        'release_info': None,
        'children': []
    }

    for line in lines[1:]:
        if line.startswith('('):
            paragraph_num = re.search('\((\d+?)\)', line).group(0)



    rest_text = article_num.group(2)
    # print(rest_text)
    print(bracket_info)
    print(bracket_info.group(1), bracket_info.group(2))
    release_info = None
    children = []
    #check if bracket_info info contains non digits
    if bool(re.search(r'\D', bracket_info.group(1))):
        release_info = bracket_info.group(1)
    
    
    #children.append(create_data_node(bracket_info.group(1)))
    
    



def main():
    articles = os.listdir('articles')
    for article in articles:
        with open('articles/' + article, 'r') as f:
            article_content = f.read()
            parse_article(article_content)


if __name__ == '__main__':
    main()