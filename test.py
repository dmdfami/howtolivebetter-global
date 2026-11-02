import urllib.request
import json
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

def search(query):
    print(f"Searching for: {query}")
