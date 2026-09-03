const express = require("express");

const { getTasks } = require("../controllers/task.controller");

const router = express.Router();

router.get("/", getTasks);

module.exports = router;
