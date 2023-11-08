# This file contain tests for books related endpoints

import requests

ENDPOINT = "http://127.0.0.1:5001/books"


# Test if can call the endpoint (GET) 
def test_can_get_books():
    response = requests.get(ENDPOINT)
    assert response.status_code == 200 #if status code is'nt 200 the test would faile

# Test if can create a book (POST)
def test_can_create_book():
    payload = {
        "title":"title",
        "author":"author",
        "publishedYear": "publishedYear",
        "bookType":"bookType"
    }
    response = requests.post(ENDPOINT, json=payload) 
    assert response.status_code == 200 #if status code is'nt 200 the test would faile

 