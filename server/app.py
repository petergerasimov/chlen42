# SPDX-FileCopyrightText: Copyright (c) 2023 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
# SPDX-License-Identifier: MIT
#
# Permission is hereby granted, free of charge, to any person obtaining a
# copy of this software and associated documentation files (the "Software"),
# to deal in the Software without restriction, including without limitation
# the rights to use, copy, modify, merge, publish, distribute, sublicense,
# and/or sell copies of the Software, and to permit persons to whom the
# Software is furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
# THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
# FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
# DEALINGS IN THE SOFTWARE.

import time

import argparse
from llama_index import ServiceContext
from llama_index import set_global_service_context
from faiss_vector_storage import FaissEmbeddingStorage
from llama_index.llms import OpenAI
import os
from dotenv import dotenv_values
from llama_index.embeddings.openai import OpenAIEmbedding

from flask import Flask, request


os.environ["OPENAI_API_KEY"] = dotenv_values(".env")["API_KEY"]


parser = argparse.ArgumentParser(description='Legal Chatbot Parameters')
parser.add_argument('--data_dir', type=str, required=False,
                    help="Directory path for data.", default="./dataset")
parser.add_argument('--verbose', type=bool, required=False,
                    help="Enable verbose logging.", default=False)
# Parse the arguments
args = parser.parse_args()
data_dir = args.data_dir
verbose = args.verbose
llm = OpenAI(model='gpt-4')
embed_model = OpenAIEmbedding()

service_context = ServiceContext.from_defaults(llm=llm, embed_model=embed_model)
set_global_service_context(service_context)

# load the vectorstore index
faiss_storage = FaissEmbeddingStorage(data_dir=data_dir, dimension=1536)
query_engine = faiss_storage.get_query_engine()

# chat function to trigger inference
def chatbot(query):
    if verbose:
        start_time = time.time()
        response = query_engine.query(query)
        end_time = time.time()
        elapsed_time = end_time - start_time
        print(f"Inference e2e time    : {elapsed_time:.2f} seconds \n")

    else:
        response = query_engine.query(query)
    
    # map response.source_nodes to array of filenames
    file_names = [node.metadata['filename'] for node in response.source_nodes]

    # return response and related files as json
    return {
        "response": response.response,
        "related_files": file_names
    }



app = Flask(__name__)

@app.route('/chat', methods=['POST'])
def chat():
    query = request.json['query']
    return chatbot(query)


if __name__ == '__main__':
    app.run(port=4000, ssl_context='adhoc')