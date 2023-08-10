const axios = require("axios");
const { searchAppender } = require("../helpers/utils");

const bookController = {
    searchBook: async (req, res, next) => {
        try {
            const { query } = req.body;

            const search_query = searchAppender(query);

            const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${search_query}`);

            return res.status(200).json(response.data);
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
};

module.exports = bookController;
