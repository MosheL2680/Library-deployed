# This file contain loans related routes

from datetime import datetime
from flask import Blueprint, jsonify, request
from sqlalchemy import func, null
from my_project import db
from my_project.models import Book, Customer, Loan


loans = Blueprint('loans', __name__)


# Route to create a new loan
@loans.route('/loans', methods=['POST'])
def create_loan():
    data = request.get_json()
    
    # Validate that required fields are present in the request data
    if 'bookID' not in data or 'customerID' not in data:
        return jsonify({'error': 'Required fields are missing in the request data (must be: bookID, and customerID)'}, 400)
    
    bookID = data['bookID']
    customerID = data['customerID']
    loanDate = datetime.now() # set the loan date to the current date

    
    # Check if the book with the specified bookID exists
    book = Book.query.get(bookID)

    # Check if the customer with the specified customerID exists
    customer = Customer.query.get(customerID)
    
    if book and book.status == 'available' and customer:
        # Update the book status to "unavailable"
        book.status = 'unavailable'

        # Create a new loan
        new_loan = Loan(loanDate=loanDate, bookID=bookID, customerID=customerID)
        db.session.add(new_loan)

        db.session.commit()

        return jsonify({'message': 'Loan created successfully!'})
    elif not customer:
        return jsonify({'error': 'Customer not found'}, 404)
    elif book and book.status == 'unavailable':
        return jsonify({'error': 'Book is already loaned'}, 400)
    else:
        return jsonify({'error': 'Book not found'}, 404)

# Route to retrieve all loans
@loans.route('/loans', methods=['GET'])
def get_loans():
    loans = Loan.query.all()
    
    loan_list = [{'loanID': loan.loanID, 'loanDate': loan.loanDate, 'MaxReturnDate': loan.maxReturnDate, 'ReturnDate': loan.returnDate, 'bookTitle': loan.book.title, 'customerName': loan.customer.Name} for loan in loans]

    return jsonify({'loans': loan_list})

# Route to end a loan
@loans.route('/loans/<int:loan_id>', methods=['PUT'])
def end_loan(loan_id):
    # Check if there is an active loan with the provided loan ID
    loan = Loan.query.filter_by(loanID=loan_id, returnDate=None).first()
    if loan:
        # Set the returnDate to the current date
        loan.returnDate = datetime.now()

        #check if the book exists, and update the book status to 'available'
        book = Book.query.get(loan.bookID)
        if book:
            book.status = 'available'

        db.session.commit()

        return jsonify({'message': 'Loan ended successfully'})
    else:
        return jsonify({'error': 'No active loan found with the provided loan ID'}, 400)

# Route to retrieve loans for which the books haven't been returned despite the expiration of the maximum return date.
@loans.route('/loans/late', methods=['GET'])
def get_late_loans():
    current_date = datetime.now().date()

    # filter late and active loans
    late_loans = Loan.query.join(Book, Loan.bookID == Book.bookID).filter(
        Loan.maxReturnDate < current_date,
        Loan.returnDate.is_(None)
    ).all()

    late_loan_list = [{'loanID': loan.loanID, 'loanDate': loan.loanDate, 'MaxReturnDate': loan.maxReturnDate, 'ReturnDate': loan.returnDate, 'bookTitle': loan.book.title, 'customerName': loan.customer.Name} for loan in late_loans]

    return jsonify({'late_loans': late_loan_list})
