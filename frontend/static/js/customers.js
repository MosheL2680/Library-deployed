// This file contain JS for "customers.html" file


let allCustomers = [];


// Create table headers
function createTableHeaders() {
    const tableHeader = document.createElement('thead');
    tableHeader.innerHTML = `
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>City</th>
            <th>Actions</th>
        </tr>
    `;
    customersTable.appendChild(tableHeader);
}

// Call createTableHeaders once when the page loads
document.addEventListener('DOMContentLoaded', createTableHeaders);

// Get an array and display it as the table body
function displayCustomers(customers) {
    const tableBody = document.createElement('tbody');

    // Remove existing rows from the table
    const existingTableBody = customersTable.getElementsByTagName('tbody')[0];
    if (existingTableBody) existingTableBody.remove();

    // Use forEach loop to display customers
    customers.forEach(function (customer) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${customer.customerID}</td>
            <td>${customer.Name}</td>
            <td>${customer.age}</td>
            <td>${customer.city}</td>
            <td>
                <button onclick="toggleEditcustomerForm(${customer.customerID})">Edit</button>
                <button onclick="deleteCustomer(${customer.customerID})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    document.getElementById('customersTable').appendChild(tableBody);
}

// Fetch all customers and display it
function getAllCustomers() {
    // send GET request to the Flask server
    axios.get('/customers')
        .then(function (response) {
            allCustomers = response.data.customers; // Assign the fetched customers to the allCustomers variable
            // Clear the search input field
            searchInput.value = ''
            // Display all customers initially
            displayCustomers(allCustomers);
        })
        .catch(function (error) {
            console.error('Error fetching customers:', error);
        });
}

// Handle form submission and add a new customer
function addNewCustomer(event) {
    event.preventDefault();

    // Get the value of the customerID input field
    let newCustomerID = parseFloat(customerID.value);

    // Check if the customer ID already exists in the array
    if (allCustomers.some(customer => parseFloat(customer.customerID) === newCustomerID)) {
        showErrorNotification('Customer ID already exists!');
        return; // Exit the function if the ID exists
    }

    // Send a POST request to Flask API to add the new customer
    axios.post('/customers', {
        "customerID": newCustomerID,
        "Name": Name.value,
        "age": age.value,
        "city": city.value
    })
        .then(function () {
            // Reload the customer list to show the newly added customer
            getAllCustomers();
            // Clear the form fields
            newCustomerForm.reset();
            // Hide the form
            toggleAddCustomerForm();
            // Show a success notification
            showSuccessNotification('New customer added successfully!');
        })
        .catch(function (error) {
            console.error('Error adding a new customer:', error);
        });
}

// Toggle the add customer form's visibility
function toggleAddCustomerForm() {
    if (addCustomerForm.style.display === 'none' || addCustomerForm.style.display === '') {
        addCustomerForm.style.display = 'block';
        toggleFormButton.textContent = 'Cancel';
    } else {
        addCustomerForm.style.display = 'none';
        toggleFormButton.textContent = 'Add New customer';
    }
}

// Attach event listeners
document.addEventListener('DOMContentLoaded', function () {
    getAllCustomers();
    newCustomerForm.addEventListener('submit', addNewCustomer);
    editCustomerForm.addEventListener('submit', editCustomer);
    toggleFormButton.addEventListener('click', toggleAddCustomerForm);
});

// Delete a customer by customerID
function deleteCustomer(customerID) {
    // Ask for confirmation from the user
    const userConfirmed = confirm("Are you sure you want to delete this customer?");
    if (userConfirmed) {
        // Send a DELETE request to Flask API to delete the customer
        axios.delete(`/customers/${parseFloat(customerID)}`)
            .then(function () {
                // Reload the customer list to reflect the deleted customer
                getAllCustomers();
                // Show a success notification
                showSuccessNotification('customer deleted successfully!');
            })
            .catch(function (error) {
                console.error(`Error deleting customer with ID ${customerID}:`, error);
            });
    }
}

// Update customer details
function editCustomer() {
    // Creating an object to store the updated customer details
    const updatedCustomer = {};

    // Check if each input object is not empty or None, then add it to the object
    if (newCustomerID.value) updatedCustomer.customerID = newCustomerID.value;
    if (newName.value) updatedCustomer.Name = newName.value;
    if (newAge.value) updatedCustomer.age = newAge.value;
    if (newCity.value) updatedCustomer.city = newCity.value;

    // Sending PUT request to Flask with the updated customer details
    axios.put(`/customers/${currentCustomerID}`, updatedCustomer)
}

// Toggle the edit customer form's visibility
function toggleEditcustomerForm(customerID) {
    currentCustomerID = customerID;
    editCustomerForm.style.display = (editCustomerForm.style.display === 'none') ? 'block' : 'none'
}

// Search a customer (by name) using "filter"
function search() {
    const search_input = searchInput.value.toLowerCase();
    const filteredcustomers = allCustomers.filter(function (customer) {
        return customer.Name.toLowerCase().includes(search_input)
    });
    displayCustomers(filteredcustomers);
}