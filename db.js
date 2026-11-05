// db.js
const books = [
    {
        code: 1,
        name: "Clean Code",
        category: "Programming",
        price: 120,
        isBorrowed: false,
        loans: [] // מערך אובייקטים: [{ borrowDate: "2026-11-01", customerCode: 101 }]
    },
    {
        code: 2,
        name: "The Pragmatic Programmer",
        category: "Programming",
        price: 140,
        isBorrowed: true,
        loans: [
            { borrowDate: "2026-10-15", customerCode: 102 }
        ]
    }
];

module.exports = { books };
// db.js
const users = [
    {
        code: 1,
        username: "noa_spivak",
        name: "Noa Spivak",
        email: "noa@example.com",
        password: "123456password",
        borrowedBookCodes: [2]
    }
];

const books = [
    {
        code: 1,
        name: "Clean Code",
        category: "Programming",
        price: 120,
        isBorrowed: false,
        loans: []
    },
    {
        code: 2,
        name: "The Pragmatic Programmer",
        category: "Programming",
        price: 140,
        isBorrowed: true,
        loans: [
            { borrowDate: "2026-10-15", customerCode: 1 }
        ]
    }
];

module.exports = { users, books };