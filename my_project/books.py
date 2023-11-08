# This file contain books related routes

from flask import Blueprint, jsonify, request
from my_project.models import Book
from my_project import db


books = Blueprint('books', __name__)


# Route to create a new book
@books.route('/books', methods=['POST'])
def create_book():
    data = request.get_json()

    # Validate that required fields are present in the request data
    if 'title' not in data or 'author' not in data or 'publishedYear' not in data or 'bookType' not in data:
        return jsonify({'error': 'Required fields are missing in the request data (must be: title, author, publishedYear, and bookType)'}, 400)
    
    title = data['title']
    author = data['author']
    publishedYear = data['publishedYear']
    bookType = data['bookType']
    
    # Validate that the title is not an empty string
    if not title:
        return jsonify({'error': 'Title cannot be empty.'}), 400

    #Validation for bookType
    if bookType not in [1, 2, 3]:
        return jsonify({'error': 'Invalid bookType. It must be 1, 2, or 3'}, 400)

    new_book = Book(title=title, author=author, publishedYear=publishedYear, bookType=bookType)
    db.session.add(new_book)
    db.session.commit()

    return jsonify({'message': 'Book created successfully!'})

# Route to retrieve all books
@books.route('/books', methods=['GET'])
def get_books():
    books = Book.query.all()

    book_list = [{'bookID': book.bookID, 'title': book.title, 'author': book.author, 'publication year': book.publishedYear, 'status': book.status, 'book Type': book.bookType} for book in books]

    return jsonify({'books': book_list})

# Route to update a book
@books.route('/books/<int:bookID>', methods=['PUT'])
def update_book(bookID):
    data = request.get_json()
    new_title = data.get('title')
    new_author = data.get('author')
    new_publishedYear = data.get('publishedYear')
    new_bookType = data.get('bookType')

    # validate that this book exists
    book = Book.query.get(bookID)
    if book:
        #check for each object if exists, to allow edit just some of the book objects
        if new_title is not None:
            book.title = new_title
        if new_author is not None:
            book.author = new_author
        if new_publishedYear is not None:
            book.publishedYear = new_publishedYear
        if new_bookType is not None:
            book.bookType = new_bookType

        db.session.commit()

        return jsonify({'message': 'Book updated successfully'})
    else:
        return jsonify({'error': 'Book not found'}, 404)

# Route to delete a book
@books.route('/books/<int:bookID>', methods=['DELETE'])
def delete_book(bookID):
    #check if the book exists
    book = Book.query.get(bookID)
    if book:
        db.session.delete(book)
        db.session.commit()
        return jsonify({'message': 'Book deleted successfully'})
    else:
        return jsonify({'error': 'Book not found'}, 404)