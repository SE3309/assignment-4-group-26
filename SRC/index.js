

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
        alert(result.message);
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
    

    // send to back end
    fetch(`/search-restaurants?name=${query}`)
    .then(response => response.json())
    .then(result => {
        console.log(result);
        
    })
    .catch(error => {
        console.error('Error during login:', error);
        alert('An error occurred. Please try again.');
    });
}

