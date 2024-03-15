## create graph
from pyvis.network import Network
import llama_index.core
from llama_index.core import StorageContext, load_index_from_storage

storage_context = StorageContext.from_defaults(persist_dir="math_index_persist")
index = load_index_from_storage(storage_context)
# retriever = llama_index.core.indices.knowledge_graph.KGTableRetriever(index)

g = index.get_networkx_graph()
net = Network(notebook=True, cdn_resources="in_line", directed=True)
net.from_nx(g)
net.show("example.html")
