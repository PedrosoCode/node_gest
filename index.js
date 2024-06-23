// index.js
const express = require('express');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = 3042;

app.use(express.json());
app.use('/api', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
