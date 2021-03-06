const express = require("express");
const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const json2csv = require("json2csv").Parser;

const router = express.Router();

router.get("/", (req, res, next) => {
  request("https://inshorts.com/en/read/politics", (error, response, html) => {
    if (!error && response.statusCode == 200) {
      var titleArray = [];
      var contentArray = [];
      var result = {};
      var inshortsData = {};
      var title;
      var content;
      var titleObj = [];
      var resultObj = [];
      var image = [];
      var time = [];
      var date = [];
      var links = [];

      const $ = cheerio.load(html);

      $(".card-stack").each((i, el) => {
        title = $(el).find(".news-card-title a").find("span").text();

        titleArray = title.split("short");

        titleArray.splice(-1, 1);

        content = $(el)
          .find(".news-card-content")
          .find("div")
          .text()
          .trim()
          .replace(/short by .+\s\s+.+/gm, "ezpz")
          .trim();

        contentArray = content.split("ezpz");

        contentArray.splice(-1, 1);

        for (var i = 0; i < contentArray.length; i++) {
          contentArray[i] = contentArray[i].trim();
        }
      });

      $("[class='news-card-image']").each(function (i, elem) {
        var bg = $(this).css("background-image");
        image[i] = bg
          .replace(/.*\s?url\([\'\"]?/, "")
          .replace(/[\'\"]?\).*/, "");
      });

      $("[itemprop='datePublished']").each(function (i, elem) {
        time[i] = $(this).text();
      });

      $("[class='date']").each(function (i, elem) {
        date[i] = $(this).text();
      });

      $("a[class='source']").each(function (i, elem) {
        links[i] = $(this).attr("href");
      });

      for (var i = 0; i < titleArray.length; i++) {
        resultObj.push({
          title: titleArray[i],
          news: contentArray[i],
          "image url": image[i],
          date: date[i],
          time: time[i],
          // "read more at": links[i]
        });
      }

      inshortsData = { data: resultObj };

      console.log(inshortsData);

      const j2cp = new json2csv();
      const csv = j2cp.parse(inshortsData.data);

      fs.writeFileSync("./inshorts.csv", csv, "utf-8");

      res.status(200).json({
        language: "English",
        category: "Politics",
        news: inshortsData,
      });
    } else {
      res.json({
        error: err,
      });
    }
  });
});

module.exports = router;
