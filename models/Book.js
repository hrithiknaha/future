const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
    {
        id: { type: String, required: true },
        title: { type: String, required: true },
        subtitle: { type: String },
        authors: [{ type: String, required: true }],
        publisher: { type: String, required: true },
        publishedDate: { type: String, required: true },
        description: { type: String, required: true },
        pageCount: { type: Number, required: true },
        categories: [{ type: String, required: true }],
        language: { type: String, required: true },
    },
    { timeseries: true, timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
