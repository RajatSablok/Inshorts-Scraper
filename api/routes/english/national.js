const express = require("express");
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs')
const json2csv = require('json2csv').Parser

const router = express.Router();

var titleArray = []
var contentArray = []
var result = {};
var inshortsData = {}
var title
var content
var titleObj = []
var resultObj = []


router.get('/', (req, res, next) => {
    request('https://inshorts.com/en/read/national', (error, response, html) => {
        if( !error && response.statusCode == 200) {
            const $ = cheerio.load(html);
          
            $('.card-stack').each((i,el) => {
    
                title = $(el)
                .find('.news-card-title a')
                .find('span').text()
    
                titleArray = title.split('short')

                titleArray.splice(-1,1)
    
                // for (var i = 0; i < titleArray.length; i++) {
                //     titleObj.push({"title": titleArray[i]})
                // }
                
                content = $(el)
                .find('.news-card-content')
                .find('div')
                .text()
                .trim()
                .replace(/short by .+\s\s+.+/gm, 'ezpz')
                .trim()
                
                contentArray = content.split('ezpz')

                contentArray.splice(-1,1)
    
                for (var i = 0; i < contentArray.length; i++) {
                    contentArray[i] = contentArray[i].trim()
                }
    
                link = $(el)
                .find('.news-card-author-time a ')
    
                for (var i = 0; i < titleArray.length; i++) {
    
                    resultObj.push({
                        
                        "title": titleArray[i],
                        "news": contentArray[i]
                      })
                }
    
            })
    
            inshortsData = {"data" : resultObj}
    
            console.log(inshortsData)
    
            const j2cp = new json2csv()
            const csv = j2cp.parse(inshortsData.data)
            
            fs.writeFileSync("./inshorts.csv", csv, "utf-8")
            
            res.status(200).json({
                language: 'English',
                category: 'National',
                message: inshortsData
            })
        }
    })
})


module.exports = router;
