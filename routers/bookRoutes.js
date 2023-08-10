const router = require("express").Router();

const bookController = require("../controllers/bookController");

router.post("/search", bookController.searchBook);
router.post("/add", bookController.addMovie);
router.get("/", bookController.readBooks);
router.get("/:bookId", bookController.readOneBooks);

module.exports = router;
