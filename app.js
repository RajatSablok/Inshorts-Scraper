const express = require('express');
const app = express();

const allNews = require('./api/routes/english/all');
const nationalNews = require('./api/routes/english/national');
const businessNews = require('./api/routes/english/business');
const worldNews = require('./api/routes/english/world');
const sportsNews = require('./api/routes/english/sports');
const politicsNews = require('./api/routes/english/politics');
const technologyNews = require('./api/routes/english/technology');
const startupNews = require('./api/routes/english/startup');
const entertainmentNews = require('./api/routes/english/entertainment');
const hatkeNews = require('./api/routes/english/hatke');
const miscellaneousNews = require('./api/routes/english/miscellaneous');
const scienceNews = require('./api/routes/english/science');
const automobileNews = require('./api/routes/english/automobile');

app.use("/en/all", allNews);
app.use("/en/national", nationalNews);
app.use("/en/business", businessNews);
app.use("/en/world", worldNews);
app.use("/en/sports", sportsNews);
app.use("/en/politics", politicsNews);
app.use("/en/technology", technologyNews);
app.use("/en/startup", startupNews);
app.use("/en/entertainment", entertainmentNews);
// app.use("/en/hatke", hatkeNews);
app.use("/en/   ", miscellaneousNews);
app.use("/en/science", scienceNews);
app.use("/en/automobile", automobileNews);

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