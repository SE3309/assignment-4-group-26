

document.getElementById('signup-form').addEventListener('submit', handleSignUp);
document.getElementById('login-form').addEventListener('submit', handleLogIn);

function toggleForm(formType) {
    const signupContainer = document.getElementById('signup-container');
    const loginContainer = document.getElementById('login-container');
    
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
        console.log('Sign up successful:', result);
        alert('Sign-up successful!');
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
        console.log('login up successful:', result);
        alert('login successful!');
    })
    .catch(error => {
        console.error('Error during login:', error);
        alert('An error occurred. Please try again.');
    });
}

