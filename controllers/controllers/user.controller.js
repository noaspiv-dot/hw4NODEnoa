let { users } = require('../db');

exports.getAllUsers = (req, res) => {
    res.status(200).json(users);
};

exports.signUp = (req, res) => {
    const { username, name, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "חובה לספק שם משתמש, אימייל וסיסמה" });
    }

    const existingUser = users.find(u => u.username === username || u.email === email);
    if (existingUser) {
        return res.status(400).json({ error: "שם המשתמש או האימייל כבר קיימים במערכת" });
    }

    const newCode = users.length > 0 ? Math.max(...users.map(u => u.code)) + 1 : 1;
    const newUser = {
        code: newCode,
        username,
        name: name || username,
        email,
        password,
        borrowedBookCodes: []
    };

    users.push(newUser);
    res.status(201).json({ message: "המשתמש נרשם בהצלחה", user: newUser });
};

exports.signIn = (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).json({ error: "שם משתמש או סיסמה לא נכונים" });
    }

    res.status(200).json({ message: "התחברות בוצעה בהצלחה", user });
};