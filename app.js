// app.js
const express = require('express');
const app = express();
const PORT = 5000;

let { books } = require('./db');

app.use(express.json());

// 1. קבלת כל הספרים
// ==========================================
app.get('/books', (req, res) => {
    res.status(200).json(books);
});

// ==========================================
// 2. קבלת ספר לפי קוד
app.get('/books/:code', (req, res) => {
    const bookCode = Number(req.params.code);
    const book = books.find(b => b.code === bookCode);

    if (!book) {
        return res.status(404).json({ error: "הספר לא נמצא" });
    }

    res.status(200).json(book);
});

// ==========================================
// 3. הוספת ספר
app.post('/books', (req, res) => {
    const { name, category, price } = req.body;

    if (!name || !category || price === undefined) {
        return res.status(400).json({ error: "נא לספק את כל הנתונים הנדרשים: שם, קטגוריה ומחיר" });
    }

    // יצירת קוד חדש אוטומטית (המקסימלי הקיים + 1, או 1 אם אין ספרים)
    const newCode = books.length > 0 ? Math.max(...books.map(b => b.code)) + 1 : 1;

    const newBook = {
        code: newCode,
        name,
        category,
        price,
        isBorrowed: false,
        loans: []
    };

    books.push(newBook);
    res.status(201).json({ message: "הספר נוסף בהצלחה", book: newBook });
});

// ==========================================
// 4. עדכון ספר (מלבד שדות השאלה)
app.put('/books/:code', (req, res) => {
    const bookCode = Number(req.params.code);
    const book = books.find(b => b.code === bookCode);

    if (!book) {
        return res.status(404).json({ error: "הספר לא נמצא" });
    }

    const { name, category, price } = req.body;

    if (name !== undefined) book.name = name;
    if (category !== undefined) book.category = category;
    if (price !== undefined) book.price = price;

    res.status(200).json({ message: "הספר עודכן בהצלחה", book });
});

// ==========================================
// 5. ביצוע השאלה (Borrow)
app.patch('/books/:code/borrow', (req, res) => {
    const bookCode = Number(req.params.code);
    const { customerCode } = req.body;
    const book = books.find(b => b.code === bookCode);

    if (!book) {
        return res.status(404).json({ error: "הספר לא נמצא" });
    }

    if (book.isBorrowed) {
        return res.status(400).json({ error: "הספר כבר מושאל" });
    }

    if (!customerCode) {
        return res.status(400).json({ error: "חובה לספק קוד לקוח לצורך השאלה" });
    }

    book.isBorrowed = true;
    
    // הוספת אובייקט למערך השאלות (השאלה)
    const newLoan = {
        borrowDate: new Date().toISOString().split('T')[0], // תאריך נוכחי בפורמט YYYY-MM-DD
        customerCode: customerCode
    };
    book.loans.push(newLoan);

    res.status(200).json({ message: "הספר הושאל בהצלחה", book });
});

// ==========================================
// 6. ביצוע חזרה (Return)
app.patch('/books/:code/return', (req, res) => {
    const bookCode = Number(req.params.code);
    const book = books.find(b => b.code === bookCode);

    if (!book) {
        return res.status(404).json({ error: "הספר לא נמצא" });
    }

    if (!book.isBorrowed) {
        return res.status(400).json({ error: "הספר אינו נמצא כרגע בהשאלה" });
    }

    book.isBorrowed = false;

    res.status(200).json({ message: "הספר הוחזר בהצלחה", book });
});

// ==========================================
// 7. מחיקת ספר לפי קוד
app.delete('/books/:code', (req, res) => {
    const bookCode = Number(req.params.code);
    const bookIndex = books.findIndex(b => b.code === bookCode);

    if (bookIndex === -1) {
        return res.status(404).json({ error: "הספר לא נמצא, לא ניתן למחוק" });
    }

    const deletedBook = books.splice(bookIndex, 1);
    res.status(200).json({ message: "הספר נמחק בהצלחה", book: deletedBook[0] });
});

// הפעלת השרת
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});