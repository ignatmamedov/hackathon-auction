import bcrypt from 'bcrypt';

export class User {
    id;
    email;
    password;
    isAdmin;

    constructor(id, email, password, isAdmin = false) {
        this.id = id;
        this.email = email;
        this.password = bcrypt.hashSync(password, 10);
        this.isAdmin = isAdmin;
    }

    /**
     * Checks if a given plain text password matches the stored hashed password.
     *
     * @param {string} plainPassword - The plain text password to check.
     * @param {string} hashedPassword - The stored hashed password to compare against.
     * @returns {boolean} True if the passwords match, otherwise false.
     */
    static checkUserPassword(plainPassword, hashedPassword) {
        return bcrypt.compareSync(plainPassword, hashedPassword);
    }
}
