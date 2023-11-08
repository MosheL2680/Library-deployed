// This file conatain JS for "loans.html" file

let allLoans = []
let activeLoans = []
let lateLoans = []



// Create table headers
function createTableHeaders() {
    const tableHeader = document.createElement('thead');
    tableHeader.innerHTML = `
        <tr>
            <th>Book</th>
            <th>Customer</th>
            <th>Loan date</th>
            <th>Latest date to return</th>
            <th>Return date</th>
        </tr>
    `;
    loansTable.appendChild(tableHeader);
}

// Get an array and display it in the table body
function displayLoans(loans) {
    const tableBody = document.createElement('tbody');
    
    // Remove existing rows from the table
    const existingTableBody = loansTable.getElementsByTagName('tbody')[0];
    if (existingTableBody) existingTableBody.remove();

    // Use forEach loop to display loans
    loans.forEach(function (loan) {
        // Check if book was returned and returnDate exists, else return: "-"
        const ReturnDate = loan.ReturnDate ? formatDate(loan.ReturnDate) : "-";
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${loan.bookTitle}</td>
        <td>${loan.customerName}</td>
        <td>${formatDate(loan.loanDate)}</td>
        <td>${formatDate(loan.MaxReturnDate)}</td>
        <td>${ReturnDate}</td>
        <td>
            ${loan.ReturnDate ? '' : `<button onclick="returnBook(${loan.loanID})">Return book</button>`}
        </td>
    `;
        tableBody.appendChild(row);
    });
    document.getElementById('loansTable').appendChild(tableBody);
}

// Fetch and display all loans using Axios
function getAllLoans() {
    // send GET request to the Flask server
    axios.get('/loans')
        .then(function (response) {
            allLoans = response.data.loans; // Assign the fetched loans to the allLoans variable
            // Display search button
            searchDiv.innerHTML =   '<input id="searchInput" style="margin-left: 85px;" type="text" onkeypress="search(allLoans)" placeholder="Enter book to search"> <button onclick="getAllLoans()">Cancel</button>'
            // Set the currently active side bar item color
            b.style.backgroundColor = '#04AA6D'
            c.style.backgroundColor = '#04AA6D'
            a.style.backgroundColor = '#333'
            // Display all loans initially
            displayLoans(allLoans);
        })
        .catch(function (error) {
            console.error('Error fetching loans:', error);
        });
}

// Call createTableHeaders and getAllLoans once when the page loads
document.addEventListener('DOMContentLoaded', createTableHeaders);
document.addEventListener('DOMContentLoaded', getAllLoans);

// Display active loans only
function displayActiveLoans() {
    // Filter out loans with no returnDate to get only active loans
    activeLoans = allLoans.filter(function (loan) {
        return !loan.ReturnDate;
    });
    // Check if there are no active loans, and tostify it, else - display active loans
    if (activeLoans.length === 0) showSuccessNotification("There are no active loans.")
    else{
        // Display the relevant search button
        searchDiv.innerHTML =   '<input id="searchInput" style="margin-left: 85px;" type="text" onkeypress="search(activeLoans)" placeholder="Enter book to search"> <button onclick="displayActiveLoans()">Cancel</button>'
        // Set the currently active side bar item color
        a.style.backgroundColor = '#04AA6D'
        c.style.backgroundColor = '#04AA6D'
        b.style.backgroundColor = '#333'
        // Clear the search input
        searchInput.value = ''
        // display it in the table
        displayLoans(activeLoans);
    }
}

// Display late loans (loans for which the books haven't been returned despite the expiration of the maximum return date).
function displayLateLoans() {
    // send GET request to flask server to get late loans
    axios.get('/loans/late')
        .then(function (response) {
            lateLoans = response.data.late_loans;

            // Use the ternary operator to conditionally show a notification or display loans
            if(lateLoans.length === 0) showSuccessNotification("There are no late loans.")
            else{
                // Display the relevant search button
                searchDiv.innerHTML =   '<input id="searchInput" style="margin-left: 85px;" type="text" onkeypress="search(lateLoans)" placeholder="Enter book to search"> <button onclick="displayLateLoans()">Cancel</button>'
                // Set the currently active side bar item color
                b.style.backgroundColor = '#04AA6D'
                a.style.backgroundColor = '#04AA6D'
                c.style.backgroundColor = '#333'
                // Clear the search input field
                searchInput.value = ''
                // display the lateLoans array in the table
                displayLoans(lateLoans);
            }
        })
        .catch(function (error) {
            console.error('Error fetching late loans:', error);
            showErrorNotification("Error fetching late loans.");
        });
}

// Format a date string to a simpler format
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Ruturn a book and end the loan
function returnBook(loanID) {
    // Ask for confirmation from the user
    const userConfirmed = confirm("Are you sure you want to return this book?");

    if (userConfirmed) {
        // Send a PUT request to the /loans/<loan_id> endpoint to end the loan
        axios.put(`/loans/${loanID}`)
            .then(function (response) {
                // Check if the request was successful
                if (response.data.message === 'Loan ended successfully') {
                    // Display a success notification
                    showSuccessNotification('Book returned successfully');
                    // Reload display active loans after ending the loan
                    getAllLoans();
                }
            })
            .catch(function (error) {
                console.error('Error returning book:', error);
                showErrorNotification('Error returning book');
            });
    } else {
        // The user canceled the action
        console.log('Book return action canceled by the user');
    }
}

// Get an array and search for a specific loan (by book title), using "filter"
function search(loans){
    const search_input = searchInput.value.toLowerCase();
    const filterLoans = loans.filter(function(loan){
        return loan.bookTitle.toLowerCase().includes(search_input)
    });
    // display the filtered array in the table
    displayLoans(filterLoans)
}