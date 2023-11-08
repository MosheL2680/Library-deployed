// This file contain common functions that I'm using in the rest of the files


// Display a success notification using Toastify
function showSuccessNotification(message) {
    Toastify({
        text: message,
        duration: 3000, // Notification will disappear after 3 seconds
        gravity: 'top', // Position it at the top of the screen
        position: 'center', // Position it horizontally in the center
        backgroundColor: '#04AA6D', // Background color for success
    }).showToast();
}

// Display an error notification using Toastify
function showErrorNotification(message) {
    Toastify({
        text: message,
        duration: 3000, // Notification will disappear after 3 seconds
        gravity: 'top', // Position it at the top of the screen
        position: 'center', // Position it horizontally in the center
        backgroundColor: 'rgb(175, 12, 12)', // Background color for errors
    }).showToast();
}

// Attach functions to the global window object
window.commonFunction = showSuccessNotification;
window.anotherCommonFunction = showErrorNotification;

