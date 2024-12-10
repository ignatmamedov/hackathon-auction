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

    static checkUserPassword(plainPassword, hashedPassword) {
        return bcrypt.compareSync(plainPassword, hashedPassword);
    }
}
