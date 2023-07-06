const axios = require('axios');
const { scrapeChapterImages, getChaptersFromVM, chapterURLEncode, getChapterURL, extractTitleFromURL, extractCurPathNameFromVM } = require('../util');
const cheerio = require('cheerio');

module.exports = (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!url) {
        reject({ status: 400, error: 'Please provide a URL to fetch' });
        return;
      }
      const response = await axios.get(url, {
        headers: {
          Referer: url,
        },
      });
      
      const html = response.data;
      const $ = cheerio.load(html);
      
      const chapters = getChaptersFromVM($, url);
      const { title, slugTitle } = extractTitleFromURL(url);
      
      const result = {
        title: title,
        slugTitle: slugTitle,
        url: url,
        chapters: [],
      };

      
      
      for (const chapter of chapters) {
        const chapterURL = chapter.url;

        // Scrape the server for each chapter
        const chapterResponse = await axios.get(chapterURL);
        const chapterHTML = chapterResponse.data;
        const chapterServer = extractCurPathNameFromVM(cheerio.load(chapterHTML));
        
        const imageUrls = await scrapeChapterImages(chapterURL, chapter.page, slugTitle, chapterServer);
        
        result.chapters.push({ ...chapter, images: imageUrls, server: chapterServer });
      }
      
      resolve(result);
    } catch (error) {
      reject({ status: 500, error: 'Error fetching the response' });
    }
  });
};
