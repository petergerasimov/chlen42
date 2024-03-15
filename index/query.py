from llama_index.core import KnowledgeGraphIndex
from llama_index.core import StorageContext, load_index_from_storage
import llama_index.core
llama_index.core.set_global_handler("langfuse")


# rebuild storage context
storage_context = StorageContext.from_defaults(persist_dir="math_index_persist")

# load index
query_engine = load_index_from_storage(storage_context).as_query_engine()

# query
query = "What are two prominent early number theorists?"
result = query_engine.query(query)
print(result)