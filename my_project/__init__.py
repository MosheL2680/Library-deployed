# This is the __init__.py file for a Flask application.
# It initializes the Flask app, configures the database connection, and registers blueprints.

from flask import Flask
from flask_sqlalchemy import SQLAlchemy


# Create a Flask instance and basic configuration
app = Flask(__name__, template_folder="frontend/html", static_folder='../frontend/static')


# Configure the SQLAlchemy database connection with an SQLite database named 'library.db'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///library.db'
db = SQLAlchemy(app)


###Register blueprints###

# Import and register blueprints for different parts of the project
from my_project.books import books
from my_project.customers import customers
from my_project.loans import loans
from my_project.views import renders

# Register the blueprints with the Flask app
app.register_blueprint(books)
app.register_blueprint(customers)
app.register_blueprint(loans)
app.register_blueprint(renders)
