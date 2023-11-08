# This file contain creation of the db models

from datetime import timedelta
from sqlalchemy import CheckConstraint, ForeignKeyConstraint
from my_project import db, app
from sqlalchemy.orm import relationship


# Define the Book model
class Book(db.Model):
    __tablename__ = 'books'

    bookID = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False, server_default='', server_onupdate='', info={'check_constraint': 'title <> ""'})
    author = db.Column(db.String(255), nullable=False)
    publishedYear = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(20), default='available')
    bookType = db.Column(db.Integer, nullable=False)

    __table_args__ = (
        CheckConstraint('LENGTH(title) > 0', name='check_title_nonempty'),
    )

    # Establish a one-to-many relationship with loans (the 'cascade' needed to be able to delete a book with a loan record)
    loans = relationship('Loan', backref='book', lazy=True, cascade='all, delete-orphan')

    def __init__(self, title, author, publishedYear, bookType):
        self.title = title
        self.author = author
        self.publishedYear = publishedYear
        self.status = 'available'
        self.bookType = bookType

# Define the Customer model
class Customer(db.Model):
    __tablename__ = 'customers'

    customerID = db.Column(db.String(255), primary_key=True)
    Name = db.Column(db.String(255), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    city = db.Column(db.String(255), nullable=False)

    # Establish a one-to-many relationship with loans (the 'cascade' needed to be able to delete a customer with a loan record)
    loans = relationship('Loan', backref='customer', lazy=True, cascade='all, delete-orphan')
    
    def __init__(self, customerID, Name, age, city):
        self.customerID = customerID
        self.Name = Name
        self.age = age
        self.city = city

# Define the Loan model
class Loan(db.Model):
    __tablename__ = 'loans'

    loanID = db.Column(db.Integer, primary_key=True)
    loanDate = db.Column(db.Date, nullable=False)
    bookID = db.Column(db.Integer, db.ForeignKey('books.bookID'), nullable=False)
    customerID = db.Column(db.Integer, db.ForeignKey('customers.customerID'), nullable=False)
    maxReturnDate = db.Column(db.Date, nullable=False)
    returnDate = db.Column(db.Date, nullable=True)

    # Data Integrity: Define a ForeignKeyConstraint to enforce the relationship
    __table_args__ = (
        ForeignKeyConstraint(['bookID'], ['books.bookID']),
        ForeignKeyConstraint(['customerID'], ['customers.customerID']),
    )

    def __init__(self, loanDate, bookID, customerID, returnDate=None):
        self.loanDate = loanDate
        self.bookID = bookID
        self.customerID = customerID
        self.returnDate = returnDate
        
        # Set the 'maxReturnDate' based on the book's type
        book = Book.query.get(bookID)
        if book:
            if book.bookType == 1:
                self.maxReturnDate = loanDate + timedelta(days=10)
            elif book.bookType == 2:
                self.maxReturnDate = loanDate + timedelta(days=5)
            elif book.bookType == 3:
                self.maxReturnDate = loanDate + timedelta(days=2)
    
        
with app.app_context():
    db.create_all()
