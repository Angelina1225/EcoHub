import validator from 'validator';

/**
 * Validate the email address to check for valid email address.
 * @param {*} emailAddress      The email address to validate.
 * @returns The validated email address.
 */
function validateEmailAddress(emailAddress) {
    // Throw an error if the email is not valid
    const emailPattern = /[~`!#$%^&*()+=\[\]{}|\\:;"'<>,?/]/;
    if (!validator.isEmail(emailAddress) || emailPattern.test(emailAddress)) {
        throw `Email is not a valid email address.`;
    }

    return emailAddress.toLowerCase();
}

/**
 * Validate the password to check for valid password.
 * @param {string} password     The password to validate.
 * @returns The validated password.
 */
function validatePassword(password) {
    const passwordReg = /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^0-9a-zA-Z]).{8,32}$/;

    // Throw an error if password conditions are not met
    if (!passwordReg.test(password)) {
        throw `Password does not meet the requirement.`;
    }

    return password;
}

export { validateEmailAddress, validatePassword };