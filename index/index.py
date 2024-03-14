import os

os.environ["OPENAI_API_KEY"] = "INSERT OPENAI KEY"

import logging
import sys

logging.basicConfig(stream=sys.stdout, level=logging.DEBUG)

from llama_index.core import SimpleDirectoryReader, KnowledgeGraphIndex
from llama_index.core.graph_stores import SimpleGraphStore

from llama_index.llms.openai import OpenAI
from llama_index.core import Settings
