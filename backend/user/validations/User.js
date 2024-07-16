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
    ],
    avatarUrl: [
        check("avatarUrl", "Enter a valid URL").optional().isURL()
    ],
    bio: [
        check("bio", "Enter a valid bio").optional().isString()
    ],
    website: [
        check("website", "Enter a valid website").optional().isURL()
    ],
    phone: [
        check("phone", "Enter a valid phone number").optional().isMobilePhone()
    ],
    tags: [
        check("tags", "Enter valid tags").optional().isArray().isIn([
            "politics",
            "sports",
            "technology",
            "entertainment",
            "science",
            "health",
            "business",
            "education",
            "lifestyle",
            "other"
        ])
    ],
    langPrefs: [
        check("langPrefs", "Enter valid language preferences").optional().isArray().isIn(
            [
                "English",
                "Spanish",
                "French",
                "German",
                "Japanese"
            ]
        )
    ]
};

module.exports = User;