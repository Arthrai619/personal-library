const Book = require("../Models/Book");

// Create a new book
exports.createBook = async (req, res) => {
  try {
    const bookData = {
      title: req.body.title,
      author: req.body.author,
      coverImage: req.body.coverImage,
      user: req.user.id,
    };
    const data = await Book.create(bookData);

    return res.status(201).json({ errors: false, data: data });
  } catch (error) {
    return res.status(500).json({ errors: true, message: error.message });
  }
};

exports.getBook = async (req, res) => {
  try {
    const data = await Book.find({ user: req.user.id });
    return res.status(200).json({ errors: false, data: data });
  } catch (error) {
    return res.status(500).json({ errors: true, message: error.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.user.id;
    const updateData = req.body;

    const book = await Book.findOneAndUpdate(
      { _id: bookId, user: userId },
      updateData,
      { new: true }
    );

    if (!book) {
      return res.status(404).json({ errors: true, message: "Book not found" });
    }

    return res.status(200).json({ errors: false, data: book });
  } catch (error) {
    return res.status(500).json({ errors: true, message: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.user.id;
    const result = await Book.deleteOne({ _id: bookId, user: userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        errors: true,
        message: "Book not found or you don't have permission",
      });
    }
    return res.status(200).json({ errors: false, data: result });
  } catch (error) {
    return res.status(500).json({ errors: true, message: error.message });
  }
};
