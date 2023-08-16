const router = require("express").Router();

const statsController = require("../controllers/statsController");

router.get("/:username", statsController.getUserStats);

module.exports = router;
