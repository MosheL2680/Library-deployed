// This file contain js for "books.html" file


let allBooks = [];


// Create table headers
function createTableHeaders() {
    const tableHeader = document.createElement('thead');
    tableHeader.innerHTML = `
        <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Publication Year</th>
            <th>Book Type</th>
            <th>Status</th>
            <th>Actions</th>
        </tr>
    `;
    booksTable.appendChild(tableHeader);
}

// Get an array and display it as the table body
function displayBooks(books) {
    const tableBody = document.createElement('tbody');

    // Remove existing rows from the table
    const existingTableBody = booksTable.getElementsByTagName('tbody')[0];
    if (existingTableBody) existingTableBody.remove();

    // Use forEach loop to display the array
    books.forEach(function (book) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book['publication year']}</td>
            <td>${book['book Type']}</td>
            <td>${book.status}</td>
            <td>
                <button onclick="loanBook(${book.bookID})">Loan</button>
                <button onclick="toggleEditBookForm(${book.bookID})">Edit</button>
                <button onclick="deleteBook(${book.bookID})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    booksTable.appendChild(tableBody);
}

// Fetch all books and display it
function getAllBooks() {
    // send GET requst to the flask server
    axios.get('/books')
        .then(function (response) {
            allBooks = response.data.books; // Assign the fetched books to the allBooks variable
            // Clear the search input field
            searchInput.value = ''
            // Display all books initially
            displayBooks(allBooks);
        })
        .catch(function (error) {
            console.error('Error fetching books:', error);
            showErrorNotification('Error fetching books')
        });
}

// Add a new book
function addNewBook(event) {
    event.preventDefault();

    // Get the selected bookType value from the radio buttons
    const selectedBookType = document.querySelector('input[name="bookType"]:checked');

    // Send a POST request to the Flask server
    axios.post('/books', {
        "title": title.value,
        "author": author.value,
        "publishedYear": publishedYear.value,
        "bookType": parseInt(selectedBookType.value)
    })
        .then(function () {
            // Reload the book list to show the newly added book
            getAllBooks();
            // Clear the form fields
            newBookForm.reset();
            // Hide the form
            toggleAddBookForm();
            // Show a success notification
            showSuccessNotification('New book added successfully!');
        })
        .catch(function (error) {
            console.error('Error adding a new book:', error);
        });
}

// Toggle the add book form's visibility
function toggleAddBookForm() {
    if (addBookForm.style.display === 'none' || addBookForm.style.display === '') {
        addBookForm.style.display = 'block';
        toggleFormButton.textContent = 'Cancel';
    } else {
        addBookForm.style.display = 'none';
        toggleFormButton.textContent = 'Add New Book';
    }
}

// Attach event listeners to the form and button
document.addEventListener('DOMContentLoaded', function () {
    // Call createTableHeaders and getAllBooks once when the page loads
    createTableHeaders();
    getAllBooks();
    // attach buttons to functions
    newBookForm.addEventListener('submit', addNewBook);
    editForm.addEventListener('submit', editBook);
    toggleFormButton.addEventListener('click', toggleAddBookForm);
});

// Delete a book by bookID
function deleteBook(bookID) {
    // Ask for confirmation from the user
    const userConfirmed = confirm("Are you sure you want to delete this book?");
    if (userConfirmed) {
        // Send a DELETE request to the Flask server
        axios.delete(`/books/${bookID}`)
            .then(function () {
                // Reload the book list to reflect the deleted book
                getAllBooks();
                // Show a success notification
                showSuccessNotification('Book deleted successfully!');
            })
            .catch(function (error) {
                console.error(`Error deleting book with ID ${bookID}:`, error);
            });
    }
}

// Update book details
function editBook() {

    // Get the book type selection value
    const selectedNewBookType = document.querySelector('input[name="newBookType"]:checked');

    // Creating an object to store the updated customer details
    const updatedBook = {};

    // check if each input is not empty or none, then add it to the "updatedBook" objedt
    if (newTitle.value) updatedBook.title = newTitle.value;
    if (newAuthor.value) updatedBook.author = newAuthor.value;
    if (newPublishedYear.value) updatedBook.publishedYear = newPublishedYear.value;
    if (selectedNewBookType) updatedBook.bookType = selectedNewBookType.value;

    // Sends the PUT request to the flask app
    axios.put(`/books/${currentBookID}`, updatedBook);
}

// Toggle the edit book form's visibility
function toggleEditBookForm(bookID) {
    currentBookID = bookID;
    editBookForm.style.display = (editBookForm.style.display === 'none') ? 'block' : 'none'
}

// Loan a book
function loanBook(bookID) {
    const book = allBooks.find((book) => book.bookID === bookID);
    // Check if the book is available
    if (book && book.status === 'available') {
        const customerID = prompt("Please enter your customer ID:"); // Prompt the user for customer ID

        // Check if the user entered a customer ID
        if (customerID !== null && customerID.trim() !== "") {
            // Send a POST request to Flask API to create a new loan for the book
            axios.post('/loans', {
                "bookID": bookID,
                "customerID": customerID,
            })
                .then(function (response) {
                    // Check if the request was successful
                    if (response.data.message === 'Loan created successfully!') {
                        // Show a success notification
                        showSuccessNotification('Book loaned successfully');
                        getAllBooks()
                    }
                    // Handle the case where customer not found
                    else showErrorNotification('Customer not found')
                })
                .catch(function (error) {
                    console.error('Error loaning book:', error);
                });
        } else {
            return
        }
    } else {
        // Handle the case where the book is not available
        showErrorNotification('The selected book is not available for loan.');
    }
}

// Search a book (by title or author) using "filter"
function search() {
    const search_Input = searchInput.value.toLowerCase();
    // use filter to get a new array with maches books, and assign it to a var
    const filteredBooks = allBooks.filter(function (book) {
        return book.title.toLowerCase().includes(search_Input) ||
            book.author.toLowerCase().includes(search_Input);
    });
    // display the new array
    displayBooks(filteredBooks);
}