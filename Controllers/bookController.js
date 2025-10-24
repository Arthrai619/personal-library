const Book = require("../models/Book");

// @desc    Create a new book (updated with duplicate check)
// @route   POST /api/books
// @access  Private
exports.createBook = async (req, res) => {
    // Destructure required fields including googleBookId for duplicate check
    const { title, author, coverImage, googleBookId } = req.body;

    // 1. Validation check for essential fields
    if (!title || !author || !googleBookId) {
        return res.status(400).json({ 
            errors: true, 
            message: "Please include title, author, and Google Book ID." 
        });
    }

    try {
        // 2. CRITICAL: CHECK FOR DUPLICATE
        const existingBook = await Book.findOne({ 
            user: req.user.id, 
            googleBookId: googleBookId 
        });

        if (existingBook) {
            // Found a duplicate! Return 409 Conflict status.
            return res.status(409).json({ 
                errors: true, 
                message: "This book is already in your library." 
            });
        }

        // 3. Create the new book entry (including googleBookId)
        const bookData = {
            title: title,
            author: author,
            coverImage: coverImage,
            googleBookId: googleBookId, // Saving the unique ID
            user: req.user.id,
        };
        const data = await Book.create(bookData);

        return res.status(201).json({ errors: false, data: data, message: "Book added successfully!" });
    } catch (error) {
        console.error("Error creating book:", error);
        return res.status(500).json({ errors: true, message: error.message });
    }
};

// @desc    Get all books for the logged-in user
// @route   GET /api/books
// @access  Private
exports.getBook = async (req, res) => {
    try {
        const data = await Book.find({ user: req.user.id });
        return res.status(200).json({ errors: false, data: data });
    } catch (error) {
        return res.status(500).json({ errors: true, message: error.message });
    }
};

// @desc    Update a book's properties
// @route   PUT /api/books/:id
// @access  Private
exports.updateBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        const userId = req.user.id;
        const updateData = req.body;

        const book = await Book.findOneAndUpdate(
            { _id: bookId, user: userId },
            updateData,
            { new: true, runValidators: true }
        );

        if (!book) {
            return res.status(404).json({ errors: true, message: "Book not found or you don't have permission" });
        }

        return res.status(200).json({ errors: false, data: book });
    } catch (error) {
        return res.status(500).json({ errors: true, message: error.message });
    }
};

// @desc    Delete a book from the user's library
// @route   DELETE /api/books/:id
// @access  Private
exports.deleteBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        const userId = req.user.id;
        
        // Use findOneAndDelete for a cleaner, more targeted deletion
        const book = await Book.findOneAndDelete({ _id: bookId, user: userId });

        if (!book) {
            return res.status(404).json({
                errors: true,
                message: "Book not found or you don't have permission to delete it.",
            });
        }
        
        return res.status(200).json({ errors: false, data: book, message: "Book removed successfully." });
    } catch (error) {
        return res.status(500).json({ errors: true, message: error.message });
    }
};
