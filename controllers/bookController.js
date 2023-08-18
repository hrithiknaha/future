const axios = require("axios");
const { searchAppender } = require("../helpers/utils");

const Book = require("../models/Book");
const User = require("../models/User");

const bookController = {
    searchBook: async (req, res, next) => {
        try {
            const { query } = req.body;

            const search_query = searchAppender(query);

            const response = await axios.get(`/books/v1/volumes?q=${search_query}`);

            return res.status(200).json(response.data);
        } catch (error) {
            console.log(error);
            next(error);
        }
    },

    getBookDetails: async (req, res, next) => {
        try {
            const response = await axios.get(`/books/v1/volumes/${req.params.bookId}`);

            return res.status(200).json(response.data);
        } catch (error) {
            next(error);
        }
    },

    addMovie: async (req, res, next) => {
        try {
            const { bookId } = req.body;

            const response = await axios.get(`/books/v1/volumes/${bookId}`);

            const { title, subtitle, authors, publisher, publishedDate, description, pageCount, categories, language } =
                response.data.volumeInfo;

            const user = await User.findOne({ username: req.user }).populate("books");

            if (!user) return res.status(200).json({ success: true, status_message: "No User." });

            const books = user.books;

            const duplicateBook = books.filter((book) => book.id === bookId);

            if (duplicateBook.length != 0)
                return res.status(409).json({ success: true, status_message: "Movie already has been added." });

            const book = await Book.create({
                id: bookId,
                title,
                subtitle,
                authors,
                publisher,
                publishedDate,
                description,
                pageCount,
                categories,
                language,
                status: "TBR",
            });

            user.books.push(book._id);
            user.save();

            return res.status(200).json(book);
        } catch (error) {
            console.log(error);
            next(error);
        }
    },

    readBooks: async (req, res, next) => {
        try {
            const user = await User.findOne({ username: req.user }).populate("books");

            if (!user) return res.status(200).json({ success: true, status_message: "No User." });

            const books = user.books;

            return res.status(200).json(books);
        } catch (error) {
            console.log(error);
            next(error);
        }
    },

    readOneBooks: async (req, res, next) => {
        try {
            const user = await User.findOne({ username: req.user }).populate("books");

            if (!user) return res.status(200).json({ success: true, status_message: "No User." });

            const books = user.books;

            const book = books.filter((book) => book.id === req.params.bookId)[0];

            if (!book) return res.status(200).json({});

            return res.status(200).json(book);
        } catch (error) {
            console.log(error);
            next(error);
        }
    },

    startReading: async (req, res, next) => {
        try {
            const { startDate } = req.body;

            const user = await User.findOne({ username: req.user }).populate("books");

            if (!user) return res.status(200).json({ success: true, status_message: "No User." });

            const books = user.books;

            const book = books.filter((book) => book.id === req.params.bookId)[0];

            if (!book)
                return res.status(200).json({
                    success: false,
                    status_message: "The resource you requested could not be found.",
                });

            const startBook = await Book.findOneAndUpdate(
                { id: req.params.bookId },
                { startDate, currentPage: 0, status: "Reading" }
            );

            return res.status(200).json({
                success: true,
                status_message: "The resource was updated.",
                book: startBook,
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    },

    updateCurrentPage: async (req, res, next) => {
        try {
            const { currentPage } = req.body;

            const user = await User.findOne({ username: req.user }).populate("books");

            if (!user) return res.status(200).json({ success: true, status_message: "No User." });

            const books = user.books;

            const book = books.filter((book) => book.id === req.params.bookId)[0];

            if (!book)
                return res.status(200).json({
                    success: false,
                    status_message: "The resource you requested could not be found.",
                });

            console.log(req.params.bookId);

            await Book.findOneAndUpdate({ id: req.params.bookId }, { $set: { currentPage } });

            return res.status(200).json({
                success: true,
                status_message: "The resource was updated.",
            });
        } catch (error) {
            next(error);
        }
    },

    endReading: async (req, res, next) => {
        try {
            const { endDate, rating } = req.body;

            const user = await User.findOne({ username: req.user }).populate("books");

            if (!user) return res.status(200).json({ success: true, status_message: "No User." });

            const books = user.books;

            const book = books.filter((book) => book.id === req.params.bookId)[0];

            if (!book)
                return res.status(200).json({
                    success: false,
                    status_message: "The resource you requested could not be found.",
                });

            if (book.status === "Completed")
                return res.status(200).json({
                    success: false,
                    status_message: "The resource has been read already.",
                });

            const endBook = await Book.findOneAndUpdate(
                { id: req.params.bookId },
                {
                    endDate,
                    rating,
                    currentPage: book.pageCount,
                    status: "Completed",
                }
            );

            return res.status(200).json({
                success: true,
                status_message: "The resource was updated.",
                book: endBook,
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    },

    stopReading: async (req, res, next) => {
        try {
            const user = await User.findOne({ username: req.user }).populate("books");

            if (!user) return res.status(200).json({ success: true, status_message: "No User." });

            const books = user.books;

            const book = books.filter((book) => book.id === req.params.bookId)[0];

            if (!book)
                return res.status(200).json({
                    success: false,
                    status_message: "The resource you requested could not be found.",
                });

            if (book.status === "Stopped")
                return res.status(200).json({
                    success: false,
                    status_message: "The resource you requested has already been stopped.",
                });

            if (book.status === "Completed")
                return res.status(200).json({
                    success: false,
                    status_message: "The resource you requested has already been read.",
                });

            const stopBook = await Book.findOneAndUpdate({ id: req.params.bookId }, { status: "Stopped" });

            return res.status(200).json({
                success: true,
                status_message: "The resource was updated.",
                book: stopBook,
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    },

    restartReading: async (req, res, next) => {
        try {
            const user = await User.findOne({ username: req.user }).populate("books");

            if (!user) return res.status(200).json({ success: true, status_message: "No User." });

            const books = user.books;

            const book = books.filter((book) => book.id === req.params.bookId)[0];

            if (!book)
                return res.status(200).json({
                    success: false,
                    status_message: "The resource you requested could not be found.",
                });

            const restartBook = await Book.findOneAndUpdate({ id: req.params.bookId }, { status: "Reading" });

            return res.status(200).json({
                success: true,
                status_message: "The resource was updated.",
                book: restartBook,
            });

            res.json(book);
        } catch (error) {
            next(error);
        }
    },
};

module.exports = bookController;
