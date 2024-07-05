const { check } = require("express-validator");

const Auth = {
    login: [
        check("username", "Enter valid user")
            .not()
            .isEmpty(),
        check("password", "Enter valid password")
            .not()
            .isEmpty()
    ]
};

module.exports = Auth;