# Library Management System

The Library Management System is a web-based application built using Flask and SQLAlchemy for managing books, customers, and loans in a library. This README provides an overview of the project, its features, and instructions for setting up and running the application.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Directory Structure](#directory-structure)
- [Web Appearance](#web-appearance)
- [Contributing](#contributing)
- [Contact](#contact)

## Features

- **Books Management:** Easily loan, add, edit, or remove books from the library's collection.
- **Customers Management:** Add, delete, and update customer information.
- **Loans Management:** Create, view, and end loans, and check for late loans.
- **Responsive Web Interface:** Access the application through a web browser with a user-friendly interface.

## Prerequisites

Before you start, ensure you have met the following requirements:

- Python (version 3.7 or higher)
- Flask
- SQLAlchemy
- SQLite (for the database)

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/MosheL2680/Library.git

2. Install the required dependencies:

    ```bash
    pip install -r requirements.txt

## Usage

1. Run the Flask application:

    ```bash
    py app.py

2. Access the application in your web browser at http://localhost:5001/. (You can also simply enter the link flask will give u in the bash)

You can now use the Library Management System to manage books, customers, and loans.

## API Endpoints

The project provides the following API endpoints:

### Books:

- `POST /books`: Create a new book.
- `GET /books`: Retrieve all books.
- `PUT /books/<bookID>`: Update a book.
- `DELETE /books/<bookID>`: Delete a book.

### Customers:

- `POST /customers`: Create a new customer.
- `GET /customers`: Retrieve all customers.
- `PUT /customers/<customerID>`: Update a customer.
- `DELETE /customers/<customerID>`: Delete a customer.

### Loans:

- `POST /loans`: Create a new loan.
- `GET /loans`: Retrieve all loans.
- `PUT /loans/<loan_id>`: End a loan.
- `GET /loans/late`: Retrieve late loans.

## Directory Structure

Here's an overview of the directory structure for this project:

- `library/`: The root directory of the project.
  - `backend/`
    - `instance/`: A directory to store the SQLite database file.
      - `library.db`: The SQLite database used by the application.
    - `my_project/`: A subdirectory containing the main project code.
      - `__init__.py`: The Python package initialization file. Conatain some basic configuration as register blueptints.
      - `models.py`: File for defining database models.
      - `books.py`: File for handling book-related routes.
      - `customers.py`: File for handling customer-related routes.
      - `loans.py`: File for handling loan-related routes.
      - `views.py`: File for handling routes to render templates the web pages.
    - `tests\`: A directory to store tests files (unittest and pytest)
    - `app.py`: This file run the app.
  - `frontend/`
      - `static/`: A directory for static files such as CSS and JavaScript.
        - `css/`: Subdirectory for CSS stylesheets.
          - `stylesheet.css`: The main CSS stylesheet.
        - `js/`: Subdirectory for JavaScript files.
          - `books.js`: JavaScript code for books.html functionality.
          - `customers.js`: JavaScript code for customers.html functionality.
          - `loans.js`: JavaScript code for loans-.html functionality.
          - `utils.js`: JavaScript jeneric functions for all files. 
        - `img/` : Subdirectory for images.
      - `html/`: A directory containing HTML files for the web interface.
  - `screenshots/`: A directory for storing screenshots of the project.
  - `readme.md`: This README file.
  - `requirements.txt`: A file listing the project's dependencies.
      



## Web Appearance

The project provides a web-based interface for managing your library's collection of books, loans, and customers. The user interface is built using HTML, CSS, and JavaScript, and it is served via a Flask web application.

### Screenshots

Here are screenshots of the different pages in the web application:

#### Home Page
![Home Page](screenshots/home.png)

#### Loans Page
![Loans Page](screenshots/loans.png)

#### Books Page
![Books Page](screenshots/books.png)

#### Customers Page
![Customers Page](screenshots/customers.png)


## Contributing

If you'd like to contribute to this project, please fork the repository and create a pull request with your changes. We welcome contributions and improvements.

## Contact

If you have any questions or need assistance, please contact me at:

- Email: moshelubetski@gmail.com
- Phone: 0544-22-0002






