// Sign up form validation
const signupForm = document.querySelector('.signup-form');

if (signupForm) {
    document.addEventListener('DOMContentLoaded', function () {
        const firstName = document.getElementById('firstName');
        const lastName = document.getElementById('lastName');
        const email = document.getElementById('email');
        const username = document.getElementById('userName');
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');

        signupForm.addEventListener('submit', function (event) {
            let valid = true;

            document.querySelectorAll('.error-message').forEach((message) => {
                message.remove();
                console.log(message);

            });

            const firstNameValue = firstName.value.trim();
            const lastNameValue = lastName.value.trim();
            const emailValue = email.value.trim();
            const usernameValue = username.value.trim();
            const passwordValue = password.value.trim();
            const confirmPasswordValue = confirmPassword.value.trim();

            const nameRegex = /\d/;

            if (firstNameValue === '' || firstNameValue.length < 2 || nameRegex.test(firstNameValue)) {
                valid = false;
                showError(firstName, 'First name must be at least 2 characters and contain only letters');
            } else {
                removeError(firstName);
            }

            if (lastNameValue === '' || lastNameValue.length < 2 || nameRegex.test(lastNameValue)) {
                valid = false;
                showError(lastName, 'Last name must be at least 2 characters and contain only letters');
            } else {
                removeError(lastName);
            }

            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if (!emailRegex.test(emailValue)) {
                valid = false;
                showError(email, 'Enter a valid email');
            } else {
                removeError(email);
            }

            const usernameRegex = /^[a-zA-Z0-9]+$/;
            if (!usernameRegex.test(usernameValue) || usernameValue.length < 5) {
                valid = false;
                showError(username, 'Username must be at least 5 characters and contain only letters and numbers');
            } else {
                removeError(username);
            }

            const passwordRegex = /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^0-9a-zA-Z]).{8,32}$/;
            if (!passwordRegex.test(passwordValue)) {
                valid = false;
                showError(password,
                    'Must be 8 characters or longer\n' +
                    'Must contain an upper case letter\n' +
                    'Must contain a lower case letter\n' +
                    'Must contain a special chacterter\n' +
                    'Must contain a number');
            } else {
                removeError(password);
            }

            if (confirmPasswordValue !== passwordValue) {
                valid = false;
                showError(confirmPassword, 'Passwords do not match');
            } else {
                removeError(confirmPassword);
            }

            if (!valid) {
                event.preventDefault();
            }
        });

        function showError(inputField, message) {
            const errorMessage = document.createElement('p');
            errorMessage.innerHTML = message.replace(/\n/g, '<br>');
            errorMessage.classList.add('error-message');
            inputField.classList.add('error');
            inputField.parentElement.appendChild(errorMessage);
        }

        function removeError(inputField) {
            inputField.classList.remove('error');

            const errorMessage = inputField.parentElement.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        }

        [firstName, lastName, email, username, password, confirmPassword].forEach((field) => {
            field.addEventListener('input', () => {
                if (field.value.trim() !== '') {
                    removeError(field);
                }
            });
        });
    });
}

// Login form validation
const loginForm = document.querySelector('.login-form');

if (loginForm) {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const loginError = document.querySelector('.error-message');

    [email, password].forEach((field) => {
        field.addEventListener('input', () => {
            if (field.value.trim() !== '') {
                loginError.remove();
            }
        });
    });

}