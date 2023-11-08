# This file contain the customers related routes

from flask import Blueprint, jsonify, request
from my_project.models import Customer
from my_project import db


customers = Blueprint('customers', __name__)


# Route to create a new customer
@customers.route('/customers', methods=['POST'])
def create_customer():
    data = request.get_json()
    # Validate that required fields are present in the request data
    if 'customerID' not in data or 'Name' not in data or 'age' not in data or 'city' not in data:
        return jsonify({'error': 'Required fields are missing in the request data (must be: customerID, Name, age, city)'}, 400)
    
    customerID = data['customerID']
    Name = data['Name']
    age = data['age']
    city = data['city']
    
    # Check if a customer with the same customerID already exists
    existing_customer = Customer.query.filter_by(customerID=customerID).first()
    if existing_customer:
        return jsonify({'error': 'CustomerID is already in use'}), 400

    new_customer = Customer(customerID=customerID, Name=Name, age=age, city=city)
    db.session.add(new_customer)
    db.session.commit()

    return jsonify({'message': 'Customer created successfully!'})

# Route to retrieve all customers
@customers.route('/customers', methods=['GET'])
def get_customers():
    customers = Customer.query.all()

    customer_list = [{'customerID': customer.customerID, 'Name': customer.Name, 'age': customer.age, 'city': customer.city} for customer in customers]

    return jsonify({'customers': customer_list})

# Route to update a customer
@customers.route('/customers/<string:customerID>', methods=['PUT'])
def update_customer(customerID):
    data = request.get_json()
    
    new_customerID = data.get('customerID')
    new_name = data.get('Name')
    new_age = data.get('age')
    new_city = data.get('city')

    # check if the customer exists
    customer = Customer.query.get(customerID)
    if customer:
            # check for each object if exists, to allow edit just part of the customer objects
            if new_customerID is not None:
                customer.customerID = new_customerID
            if new_name is not None:
                customer.Name = new_name
            if new_age is not None:
                customer.age = new_age
            if new_city is not None:
                customer.city = new_city

            db.session.commit()

            return jsonify({'message': 'Customer updated successfully'})
    else:
        return jsonify({'error': 'Customer not found'}, 404)

# Route to delete a customer
@customers.route('/customers/<string:customerID>', methods=['DELETE'])
def delete_customer(customerID):
    customer = Customer.query.get(customerID)
    # check if the customer exists
    if customer:
        db.session.delete(customer)
        db.session.commit()
        return jsonify({'message': 'Customer deleted successfully'})
    else:
        return jsonify({'error': 'Customer not found'}, 404)
