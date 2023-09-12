const router = require("express").Router();
const { createWorker } = require("../controllers/adminController");

router.post("/worker/new", createWorker);

module.exports = router;
