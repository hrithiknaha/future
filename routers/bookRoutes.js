const bookController = require("../controllers/bookController");

const router = require("express").Router();

router.post("/search", bookController.searchBook);

module.exports = router;
