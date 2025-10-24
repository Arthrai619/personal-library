// controllers/bookController.js (assuming you have a POST handler here)

const Book = require("../Models/Book"); // Ensure your model is imported
// ... other imports

// @desc    Add a book to the user's library and check for duplicates
// @route   POST /api/books
// @access  Private
exports.addBookToLibrary = async (req, res) => {
    // Assuming authentication middleware sets req.user
    const { title, author, coverImage, googleBookId } = req.body; 
    
    // 1. Validation check
    if (!title || !author || !googleBookId) {
        return res.status(400).json({ message: "Please include title, author, and Google Book ID." });
    }

    try {
        // 2. CHECK FOR DUPLICATE
        const existingBook = await Book.findOne({ 
            user: req.user.id, 
            googleBookId: googleBookId 
        });

        if (existingBook) {
            // Found a duplicate! Return 409 Conflict status.
            return res.status(409).json({ message: "This book is already in your library." });
        }

        // 3. Create the new book entry
        const book = await Book.create({
            user: req.user.id,
            title,
            author,
            coverImage,
            googleBookId, 
        });

        // 4. Success response
        return res.status(201).json({ message: "Book added successfully!", data: book });

    } catch (error) {
        // Log the error and send a generic server error response
        console.error(error);
        return res.status(500).json({ message: "Server error during book creation.", error: error.message });
    }
};

