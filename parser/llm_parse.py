# [START aiplatform_gemini_multiturn_chat_stream]
from prompt import get_prompt
import vertexai
from vertexai.generative_models import GenerativeModel
import os

# TODO(developer): Update and un-comment below lines
project_id = "sectbot"
location = "us-central1"
vertexai.init(project=project_id, location=location)
model = GenerativeModel("gemini-1.0-pro")

# read input file
with open("../prompting/test/testcase.txt", "r") as f:
    input_text = f.read()

prompt = get_prompt(input_text)

with open("prompt.txt", "w") as f:
    f.write(prompt)

responses = model.generate_content(
  prompt,
  stream=True,
  generation_config={
    "max_output_tokens": 8096,
    "temperature": 0,
    "top_p": 1
  }
)
for chunk in responses:
    try:
      print(chunk.text, end="")
    except Exception as e:
      print(chunk)
      print(e)

