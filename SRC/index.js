import { handleReviewClicked } from './review.js';

document.getElementById('signup-form').addEventListener('submit', handleSignUp);
document.getElementById('login-form').addEventListener('submit', handleLogIn);
document.getElementById('search').addEventListener('click', searchRestaurants);
document.getElementById('view-order-history').addEventListener('click', fetchOrderHistory);

const signupContainer = document.getElementById('signup-container');
const loginContainer = document.getElementById('login-container');
const searchContainer = document.getElementById('search-container');

function toggleForm(formType) {

    if (formType === 'login') {
        signupContainer.style.display = 'none';
        loginContainer.style.display = 'block';
    } else {
        signupContainer.style.display = 'block';
        loginContainer.style.display = 'none';
    }
}
window.toggleForm = toggleForm;

function handleSignUp(event) {
    event.preventDefault();
    let firstName = document.getElementById("signup-firstname").value
    let lastName = document.getElementById("signup-lastname").value
    let password = document.getElementById("signup-password").value
    let email = document.getElementById("signup-email").value
    console.log("running")
    let data = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
    };

    // Send data to backend
    fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(result => {
            alert(result.message);
        })
        .catch(error => {
            console.error('Error during sign-up:', error);
            alert('An error occurred. Please try again.');
        });
}

function handleLogIn(event) {

    let password = document.getElementById("login-password").value
    let email = document.getElementById("login-email").value
    event.preventDefault();

    let data = {
        email: email,
        password: password,
    };


    // Send data to backend
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            // Store customerId in localStorage
            localStorage.setItem('customerId', result.customerId);

            loginContainer.style.display = 'none';
            searchContainer.style.display = 'block';

        })
        .catch(error => {
            console.error('Error during login:', error);
            alert('An error occurred. Please try again.');
        });
}

// to search restaurants
function searchRestaurants(event) {

    const query = document.getElementById('search-bar').value
    const display_list = document.getElementById('restaurant-list')
    display_list.innerHTML = '';
    const limit = document.getElementById('results').value
    const reviewContainer = document.getElementById('review-container').value

    // send to back end
    fetch(`/search-restaurants?name=${query}&limit=${limit}`)
        .then(response => response.json())
        .then(result => {
            console.log(result.data);
            const data = result.data
            data.forEach(item => {
                const listItem = document.createElement('li');
                const name = document.createElement('h3');
                const address = document.createElement('p');
                const genre_rating = document.createElement('p');
                // can set up add review and place orders here with a function call
                const add_review = document.createElement('button');
                // attach review function
                // add_review.addEventListener('click', () => handleReviewClicked(item.restaurantName));
                add_review.addEventListener('click', () => reviewContainer.display === "none" ? reviewContainer.display = "block" : reviewContainer.display = "none");
                const order = document.createElement('button');
                name.textContent = item.restaurantName;
                address.textContent = item.streetNumber + ' ' + item.street + ', ' + item.city
                const roundedAverageReview = Math.round(item.average_review * 10) / 10
                if (roundedAverageReview > 0) {
                    genre_rating.textContent = 'Genre: ' + item.genre + ' \tRating: ' + roundedAverageReview + '/5'
                } else {
                    genre_rating.textContent = 'Genre: ' + item.genre
                }
                add_review.textContent = 'Add Review'
                order.textContent = 'Place Order'

                listItem.appendChild(name)
                listItem.appendChild(address)
                listItem.appendChild(genre_rating)
                listItem.appendChild(add_review)
                listItem.appendChild(order)
                display_list.appendChild(listItem);
            })

        })
        .catch(error => {
            console.error('Error during login:', error);
            display_list.appendChild(document.createTextNode('An error occurred. Please try again.'))
        });
}

function fetchOrderHistory() {
    const customerId = localStorage.getItem('customerId'); // Retrieve customerId from localStorage

    if (!customerId) {
        alert('Customer ID not found. Please log in again.');
        return;
    }

    console.log(customerId)
    fetch(`/order-history?customerId=${customerId}`)
        .then(response => {
            console.log('Response Status:', response.status);
            return response.json();
        })
        .then(result => {
            console.log('Order History Result:', result);
            if (result.success && result.data) {
                displayOrderHistory(result.data);
            } else {
                alert('Failed to fetch order history: ' + result.message);
            }
        })
        .catch(error => {
            console.error('Error fetching order history:', error);
            alert('An error occurred. Please try again.');
        });
}

function displayOrderHistory(orderHistory) {
    const orderHistoryList = document.getElementById('order-history-list');
    orderHistoryList.innerHTML = ''; // Clear any existing history

    if (orderHistory.length === 0) {
        orderHistoryList.innerHTML = '<li>No order history found.</li>';
        return;
    }

    // Populate the list with order details
    orderHistory.forEach(order => {
        const listItem = document.createElement('li');
        listItem.textContent = `Date: ${order.orderDate}, Restaurant: ${order.restaurantName}, Total Cost: $${order.totalCost.toFixed(2)}`;
        orderHistoryList.appendChild(listItem);
    });
}
