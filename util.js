async function scrapeChapterImages(chapterURL, numberOfPages, unformattedTitle, server) {
    try {
        const imageUrls = [];

        const chapterNumber = chapterURL.match(/-chapter-(\d+)\.html/)[1];
        // Format chapter number as 4 digits (e.g., 1 => 0001, 23 => 0023)
        const formattedChapterNumber = chapterNumber.toString().padStart(4, '0');

        // Loop through the number of pages in the chapter
        for (let i = 1; i <= numberOfPages; i++) {
            // Format image number as 3 digits (e.g., 1 => 001, 14 => 014)
            const formattedImageNumber = i.toString().padStart(3, '0');

            // Construct the image URL
            const imageUrl = `https://${server}/manga/${unformattedTitle}/${formattedChapterNumber}-${formattedImageNumber}.png`;

            // Push the image URL to the array
            imageUrls.push(imageUrl);
        }

        return imageUrls;
    } catch (error) {
        throw new Error(`Error scraping images for chapter: ${error.message}`);
    }
}


function getChaptersFromVM($, url) {
    const scriptTag = $('script:contains("var vm = this;")').html();
    const vmRegex = /vm\.CHAPTERS = (\[.*?\]);/g;
    const vmMatches = vmRegex.exec(scriptTag);

    if (!vmMatches || !vmMatches[1]) {
        throw new Error('Chapter data not found in the vm variable');
    }

    const chaptersData = JSON.parse(vmMatches[1]);

    const chapters = chaptersData.map((chapterObject) => {
        const chapterString = chapterObject.Chapter;
        const type = chapterObject.Type;
        const page = chapterObject.Page;

        const chapter = chapterURLEncode(chapterString);
        const chapterURL = getChapterURL(url, chapter);

        return { chapter, type, page, url: chapterURL };
    });

    return chapters;
}

function chapterURLEncode(chapterString) {
    const indexString = chapterString.substring(0, 1);
    const index = indexString !== '1' ? `-index-${indexString}` : '';

    const chapter = parseInt(chapterString.slice(1, -1));

    const oddString = chapterString[chapterString.length - 1];
    const odd = oddString !== '0' ? `.${oddString}` : '';

    return `-chapter-${chapter}${odd}${index}`;
}

function getChapterURL(baseURL, chapter) {
    const urlParts = baseURL.split('/');
    const mangaTitle = urlParts[urlParts.length - 1].split('-chapter-')[0];
    const chapterURL = `https://mangasee123.com/read-online/${mangaTitle}${chapter}.html`;
    return chapterURL;
}

function extractTitleFromURL(url) {
    const urlParts = url.split('/');
    const lastPart = urlParts[urlParts.length - 1];
    const slugTitle = lastPart.split('-chapter-')[0];
    const unformattedTitle = slugTitle.replace(/-/g, ' ');

    const title = unformattedTitle
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    return {
        title: title,
        unformattedTitle: unformattedTitle,
        slugTitle: slugTitle
    };
}


function extractCurPathNameFromVM($) {
    const scriptTag = $('script:contains("var vm = this;")').html();
    const curPathNameRegex = /vm\.CurPathName = "(.*?)";/g;
    const curPathNameMatches = curPathNameRegex.exec(scriptTag);

    if (!curPathNameMatches || !curPathNameMatches[1]) {
        throw new Error('CurPathName not found in the vm variable');
    }

    const curPathName = curPathNameMatches[1];
    return curPathName;
}

module.exports = {
    scrapeChapterImages,
    getChaptersFromVM,
    chapterURLEncode,
    getChapterURL,
    extractTitleFromURL,
    extractCurPathNameFromVM,
};