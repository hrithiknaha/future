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

            return res.status(200).json(book);
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
};

module.exports = bookController;
