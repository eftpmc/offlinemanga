# MangaSee Scraper

This is a MangaSee scraper that allows you to fetch manga chapters and images from the MangaSee website. It provides a simple API for retrieving manga information and downloading chapters as PDF or EPUB files for offline reading.

## Features

- Fetch manga information including titles, chapters, and images
- Download manga chapters as PDF or EPUB files
- Customize the download options such as image quality and chapter range

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/eftpmc/offlinemanga.git
   ```

2. Install the dependencies:

   ```
   npm install
   ```

## Usage

1. Start the server:

   ```
   npm start
   ```

   This will start the MangaSee scraper server.

2. Access the API endpoints:

   - Get manga information: `GET /api/manga?url=<manga-url>`
   - Download manga chapter as PDF: `GET /api/chapter/pdf?url=<chapter-url>`
   - Download manga chapter as EPUB: `GET /api/chapter/epub?url=<chapter-url>`

   Replace `<manga-url>` with the URL of the manga you want to fetch information for, and `<chapter-url>` with the URL of the chapter you want to download.

3. Customize the download options:

   You can customize the download options by passing additional parameters to the download endpoints. For example, to specify the image quality, use `quality` parameter: `GET /api/chapter/pdf?url=<chapter-url>&quality=high`.

   Refer to the API documentation for more details on available parameters.

## API Documentation

For detailed information about the API endpoints and parameters, refer to the [API Documentation](api-documentation.md).

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please create an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
