const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const writeStream = fs.createWriteStream('news.csv');

// Write Headers
writeStream.write(`Title,Content \n`);
var titleArray = []
var contentArray = []
var result = {};
const inshortsData = []
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

            for (var i = 0; i < titleArray.length; i++) {
                titleObj.push({"title": titleArray[i]})
            }
            
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

            console.log(contentArray)

            //follow next two lines to remove the date and time (not needed in this version)
            // contentt = content.replace(/\s\s+/gm, 'mynewhack')
            // contentArray = contentt.split('mynewhack')

            titleArray.forEach((key, i) => result[key] = contentArray[i]);

            link = $(el)
            .find('.news-card-author-time a ')

            for (var i = 0; i < titleArray.length; i++) {

                // resultObj.push({"title": titleArray[i]}, {"news": contentArray[i]})

                resultObj.push({
                    
                    "title": titleArray[i],
                    "news": contentArray[i]
                  })

                
            }

            // console.log(titleArray)
            // console.log(content)
            // console.log(contentArray)

            // console.log(result);

        // Write Row To CSV
        // writeStream.write(`${title}, ${newwContent} \n`);

        })
        console.log(titleArray)
        console.log('test')
        console.log(contentArray[5])
        console.log('test')
        // console.log(result)
        console.log(resultObj)


    }
})