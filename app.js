const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const writeStream = fs.createWriteStream('news.csv');

// Write Headers
writeStream.write(`Title,Content \n`);

request('https://inshorts.com/en/read/', (error, response, html) => {
    if( !error && response.statusCode == 200) {
        const $ = cheerio.load(html);

        $('.card-stack').each((i,el) => {

            const title = $(el)
            .find('.news-card-title a')
            .find('span').text()
            .replace(/short+/g, '\n');

            titleArray = title.split('\n')

            const content = $(el)
            .find('.news-card-content')
            .find('div')
            .text() 
            .replace(/short by .+\s\s+.+/gm, '')

            contentt = content.replace(/\s\s+/gm, 'mynewhack')

            contentArray = contentt.split('mynewhack')

            var result = {};
            titleArray.forEach((key, i) => result[key] = contentArray[i]);

            console.log(title)
            console.log(titleArray)
            console.log(content)
            console.log(contentArray)

            console.log(result);

        // Write Row To CSV
        // writeStream.write(`${title}, ${newwContent} \n`);

        })
    }
})