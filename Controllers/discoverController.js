// controllers/discoverController.js

const axios = require("axios");

// @desc    Search the Google Books API
// @route   GET /api/discover?search=...
// @access  Public
exports.searchGoogleBooks = async (req, res) => {
  try {
    // 1. Get the search term from the query string
    const { search } = req.query;

    if (!search) {
      return res
        .status(400)
        .json({ errors: true, message: "Please provide a search term" });
    }

    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    const API_URL = `https://www.googleapis.com/books/v1/volumes?q=${search}&key=${apiKey}&maxResults=20`;

    // 2. Call the Google Books API
    const response = await axios.get(API_URL);

    // 3. Check if Google returned any books
    if (!response.data.items) {
      return res.status(200).json({ errors: false, data: [] }); // Send empty array
    }

    // 4. Clean up the data (Google's response is very messy)
    // We will format it to look similar to our *own* Book model
    const books = response.data.items.map((book) => {
      const info = book.volumeInfo;

      return {
        googleBookId: book.id, // Very important for saving later
        title: info.title,
        authors: info.authors ? info.authors : ["Unknown Author"],
        description: info.description || "No description available.",
        coverImage: info.imageLinks ? info.imageLinks.thumbnail : null,
      };
    });

    // 5. Send the clean list of books to our frontend
    return res.status(200).json({ errors: false, data: books });
  } catch (error) {
    return res.status(500).json({ errors: true, message: error.message });
  }
};