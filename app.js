const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs')
const json2csv = require('json2csv').Parser

var titleArray = []
var contentArray = []
var result = {};
var inshortsData = {}
var title
var content
var titleObj = []
var resultObj = []


request('https://inshorts.com/en/read/', (error, response, html) => {
    if( !error && response.statusCode == 200) {
        const $ = cheerio.load(html);
      
        $('.card-stack').each((i,el) => {

            title = $(el)
            .find('.news-card-title a')
            .find('span').text()

            titleArray = title.split('short')

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

            for (var i = 0; i < contentArray.length; i++) {
                contentArray[i] = contentArray[i].trim()
            }

            //follow next two lines to remove the date and time (not needed in this version)
            // contentt = content.replace(/\s\s+/gm, 'mynewhack')
            // contentArray = contentt.split('mynewhack')

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

    }
})