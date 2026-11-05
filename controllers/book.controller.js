let { books, users } = require('../db');

exports.getAllBooks = (req, res) => {
    let result = [...books];
    const { name, limit, page } = req.query;

    if (name) {
        result = result.filter(b => b.name.toLowerCase().includes(name.toLowerCase()));
    }

    const parsedLimit = parseInt(limit) || result.length;
    const parsedPage = parseInt(page) || 1;
    const startIndex = (parsedPage - 1) * parsedLimit;
    const paginatedResult = result.slice(startIndex, startIndex + parsedLimit);

    res.status(200).json({
        totalBooks: result.length,
        page: parsedPage,
        limit: parsedLimit,
        data: paginatedResult
    });
};

exports.getBookByCode = (req, res) => {
    const bookCode = Number(req.params.code);
    const book = books.find(b => b.code === bookCode);
    if (!book) return res.status(404).json({ error: "הספר לא נמצא" });
    res.status(200).json(book);
};

exports.addBook = (req, res) => {
    const { name, category, price } = req.body;
    if (!name || !category || price === undefined) {
        return res.status(400).json({ error: "חובה לספק שם, קטגוריה ומחיר" });
    }
    const newCode = books.length > 0 ? Math.max(...books.map(b => b.code)) + 1 : 1;
    const newBook = { code: newCode, name, category, price, isBorrowed: false, loans: [] };
    books.push(newBook);
    res.status(201).json({ message: "הספר נוסף בהצלחה", book: newBook });
};

exports.updateBook = (req, res) => {
    const bookCode = Number(req.params.code);
    const book = books.find(b => b.code === bookCode);
    if (!book) return res.status(404).json({ error: "הספר לא נמצא" });

    const { name, category, price } = req.body;
    if (name !== undefined) book.name = name;
    if (category !== undefined) book.category = category;
    if (price !== undefined) book.price = price;

    res.status(200).json({ message: "הספר עודכן בהצלחה", book });
};

exports.borrowBook = (req, res) => {
    const bookCode = Number(req.params.code);
    const { userCode } = req.body;

    const book = books.find(b => b.code === bookCode);
    if (!book) return res.status(404).json({ error: "הספר לא נמצא" });
    if (book.isBorrowed) return res.status(400).json({ error: "הספר כבר מושאל" });

    const user = users.find(u => u.code === Number(userCode));
    if (!user) return res.status(404).json({ error: "המשתמש לא נמצא" });

    // עדכון הספר
    book.isBorrowed = true;
    book.loans.push({
        borrowDate: new Date().toISOString().split('T')[0],
        customerCode: user.code
    });

    // עדכון המשתמש
    if (!user.borrowedBookCodes) user.borrowedBookCodes = [];
    user.borrowedBookCodes.push(book.code);

    res.status(200).json({ message: "הספר הושאל בהצלחה", book, user });
};

exports.returnBook = (req, res) => {
    const bookCode = Number(req.params.code);
    const { userCode } = req.body;

    const book = books.find(b => b.code === bookCode);
    if (!book) return res.status(404).json({ error: "הספר לא נמצא" });
    if (!book.isBorrowed) return res.status(400).json({ error: "הספר לא מושאל" });

    const user = users.find(u => u.code === Number(userCode));

    book.isBorrowed = false;

    if (user && user.borrowedBookCodes) {
        user.borrowedBookCodes = user.borrowedBookCodes.filter(c => c !== bookCode);
    }

    res.status(200).json({ message: "הספר הוחזר בהצלחה", book });
};

exports.deleteBook = (req, res) => {
    const bookCode = Number(req.params.code);
    const index = books.findIndex(b => b.code === bookCode);
    if (index === -1) return res.status(404).json({ error: "הספר לא נמצא" });

    const deleted = books.splice(index, 1);
    res.status(200).json({ message: "הספר נמחק בהצלחה", book: deleted[0] });
};