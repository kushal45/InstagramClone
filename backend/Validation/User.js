const { check } = require("express-validator");

const User = {
    withPassword: [
        check("name", "Enter your full name")
            .not()
            .isEmpty(),
        check("username", "Enter your username")
            .not()
            .isEmpty(),
        check("email", "Enter a valid email").isEmail(),
        check("password", "Password must be at least 6 characters").isLength({
            min: 6
        })
    ],
    withoutPassword: [
        check("name", "Enter your full name")
            .not()
            .isEmpty(),
        check("email", "Enter valid email").isEmail()
    ],
    password: [
        check("password", "password must be at least 6 characters").isLength({
            min: 6
        }),
        check(
            "password_confirm",
            "Password confirmation must be at least 6 characters"
        ).isLength({
            min: 6
        })
    ]
};

module.exports = User;