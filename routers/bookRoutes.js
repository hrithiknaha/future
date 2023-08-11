const router = require("express").Router();

const bookController = require("../controllers/bookController");

router.post("/search", bookController.searchBook);
router.post("/add", bookController.addMovie);
router.get("/", bookController.readBooks);
router.get("/:bookId", bookController.readOneBooks);
router.post("/:bookId/start", bookController.startReading);
router.post("/:bookId/end", bookController.endReading);
router.get("/:bookId/stop", bookController.stopReading);

module.exports = router;
