# This file contain routes to render template web pages and img

from flask import Blueprint, render_template


renders = Blueprint('renders', __name__)


# Routes to render templates the web pages
@renders.route('/')
def index_page():
    return render_template('index.html')

@renders.route('/Loans')
def loans_page():
    return render_template('loans.html')

@renders.route('/Books')
def books_page():
    return render_template('books.html')

@renders.route('/Customers')
def customers_page():
    return render_template('customers.html')

# Route to serve static image files from the 'img' dir
@renders.route('/../static/img/<image_filename>')
def serve_image(image_filename):
    return renders.send_static_file('img/' + image_filename)