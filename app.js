const express = require('express');
const app = express();

const allNews = require('./api/routes/english/all');
const nationalNews = require('./api/routes/english/national');
const businessNews = require('./api/routes/english/business');

app.use("/en/all", allNews);
app.use("/en/national", nationalNews);
app.use("/en/business", businessNews);

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});
  
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message
      }
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));