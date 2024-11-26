let data = {
    firstName: "wow",
    lastName: "ple",
    email: "test@gmail.com",
    password: "creep",
};

// Send data to backend
fetch('http://localhost:3000/signup', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
})
.then(response => response.json())
.then(result => {
    console.log('Sign up successful:', result);
    // alert('Sign-up successful!');
})
.catch(error => {
    console.error('Error during sign-up:', error);
    // alert('An error occurred. Please try again.');
});