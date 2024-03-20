class Client {
    id;
    first_name;
    last_name;
    email;
    gender;
    image;

    constructor(first_name='', last_name='', email='', gender='', image='', id) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.gender = gender;
        this.image = image;
    }
}

module.exports = Client;