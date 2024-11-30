

document.getElementById('signup-form').addEventListener('submit', handleSignUp);
document.getElementById('login-form').addEventListener('submit', handleLogIn);
document.getElementById('search').addEventListener('click', searchRestaurants);

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

function handleSignUp(event){
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

function handleLogIn(event){
   
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
        loginContainer.style.display = 'none';
        searchContainer.style.display = 'block';

    })
    .catch(error => {
        console.error('Error during login:', error);
        alert('An error occurred. Please try again.');
    });
}

// to search restaurants
function searchRestaurants (event) {

    const query = document.getElementById('search-bar').value
    const display_list = document.getElementById('restaurant-list')
    display_list.innerHTML = ''; 
    const limit = document.getElementById('results').value

    // send to back end
    fetch(`/search-restaurants?name=${query}&limit=${limit}`)
    .then(response => response.json())
    .then(result => {
        console.log(result.data);
        data = result.data
        data.forEach(item => {
            const listItem = document.createElement('li'); 
            const name = document.createElement('h3');
            const address = document.createElement('p');
            const genre_rating = document.createElement('p');
            // can set up add review and place orders here with a function call
            const add_review = document.createElement('button');
            const order = document.createElement('button');
            name.textContent = item.restaurantName;
            address.textContent = item.streetNumber + ' ' + item.street + ', ' + item.city
            roundedAverageReview = Math.round(item.average_review * 10) / 10
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

