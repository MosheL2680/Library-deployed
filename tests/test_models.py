# This file contain tests for models

from my_project import db, app
import sqlite3
import pytest
from my_project.models import Book, Loan

def test_create_book():
    book = Book(title="Sample Book", author="John Doe", publishedYear="2022", bookType=1)
    assert book.title == "Sample Book"
    assert book.author == "John Doe"
    assert book.publishedYear == "2022"
    assert book.bookType == 1
    assert book.status == "available"

def test_book_relationship_with_loans(db):
    # Create a book
    book = Book(title="Sample Book", author="John Doe", publishedYear="2022", bookType=1)
    
    # Create a loan associated with the book
    loan = Loan(loanDate="2022-10-01", book=book)
    db.session.add(loan)
    db.session.commit()

    # Check if the book has a loan
    assert len(book.loans) == 1
    assert book.loans[0] == loan
    
def test_invalid_book_creation():
    with pytest.raises(sqlite3.IntegrityError):
        book = Book(title="", author="Author", publishedYear="2023", bookType=1)
        db.session.add(book)
        db.session.commit()

if __name__ == "__main__":
    pytest.main()
