const express = require('express');
const app = express();
const PORT = 5000;

// ייבוא הראוטר הראשי מתיקיית routes
const apiRoutes = require('./routes/index.route');

app.use(express.json());

// קישור הראוטר תחת /api
app.use('/api', apiRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});