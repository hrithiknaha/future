const moment = require("moment");
const User = require("../models/User");
const { getMonth } = require("../helpers/utils");

const statsController = {
    getUserStats: async (req, res, next) => {
        try {
            const { username } = req.params;

            const user = await User.findOne({ username }).populate("books").select("-password");

            if (!user)
                return res.status(200).json({
                    success: false,
                    status_message: "The resource you requested could not be found.",
                });

            const books = user.books;

            if (books.length === 0)
                return res.status(200).json({
                    success: false,
                    status_message: "No Data to have stats.",
                });

            const totalBooks = books.length;
            let totalPages = 0;
            let totalRating = 0;
            let completedBooks = 0;

            const statusMap = new Map();
            const authorMap = new Map();
            const publishedDateMap = new Map();
            const genreMap = new Map();
            const monthCompletedMap = new Map();
            const completedLengthMap = new Map();
            const completedRatingMap = new Map();

            for (let i = 0; i < 12; i++) monthCompletedMap.set(i, 0);

            for (let i = 1; i < 11; i++) completedRatingMap.set(i, 0);

            for (const book of books) {
                totalPages += book.pageCount;

                if (book.status === "Completed") {
                    completedBooks++;
                    totalRating += book.rating;

                    const completedMonth = moment(book.endDate).month();
                    monthCompletedMap.set(completedMonth, (monthCompletedMap.get(completedMonth) || 0) + 1);

                    if (book.pageCount < 300)
                        completedLengthMap.set("small", (completedLengthMap.get("small") || 0) + 1);
                    else if (book.pageCount > 300 && book.pageCount < 500)
                        completedLengthMap.set("medium", (completedLengthMap.get("medium") || 0) + 1);
                    else completedLengthMap.set("big", (completedLengthMap.get("big") || 0) + 1);

                    completedRatingMap.set(book.rating, (completedRatingMap.get(book.rating) || 0) + 1);
                }

                statusMap.set(book.status, (statusMap.get(book.status) || 0) + 1);

                const publishedYear = moment(book.publishedDate).year();
                publishedDateMap.set(publishedYear, (publishedDateMap.get(publishedYear) || 0) + 1);

                for (const author of book.authors) authorMap.set(author, (authorMap.get(author) || 0) + 1);

                const uniqueGenres = [];
                for (const genre of book.categories) {
                    const individualGenres = genre.split(" / ");

                    for (const individualGenre of individualGenres) {
                        if (!uniqueGenres.includes(individualGenre)) uniqueGenres.push(individualGenre);
                    }
                }

                for (const genre of uniqueGenres) genreMap.set(genre, (genreMap.get(genre) || 0) + 1);
            }

            const averageRating = totalRating / completedBooks;

            const statusDataset = Array.from(statusMap, ([name, count]) => ({ name, count }));
            const publishedYearDataset = Array.from(publishedDateMap, ([name, count]) => ({ name, count })).sort(
                (a, b) => (a.name > b.name ? 1 : -1)
            );
            const authorDataset = Array.from(authorMap, ([name, count]) => ({ name, count })).sort((a, b) =>
                a.count < b.count ? 1 : -1
            );
            const genreDataset = Array.from(genreMap, ([name, count]) => ({ name, count })).sort((a, b) =>
                a.count < b.count ? 1 : -1
            );
            const completedMonthDataset = Array.from(monthCompletedMap, ([name, count]) => ({
                name,
                month: getMonth(name),
                count,
            })).sort((a, b) => (a.name > b.name ? 1 : -1));

            const completedLengthDataset = Array.from(completedLengthMap, ([name, count]) => ({ name, count }));

            const completedRatingDataset = Array.from(completedRatingMap, ([name, count]) => ({ name, count })).sort();

            res.status(200).json({
                totalBooks,
                totalPages,
                averageRating,
                statusDataset,
                publishedYearDataset,
                authorDataset,
                genreDataset,
                completedMonthDataset,
                completedLengthDataset,
                completedRatingDataset,
            });
        } catch (error) {
            next(error);
        }
    },
};

module.exports = statsController;
