

const express = require("express");
const router = express.Router();



router.get("/contact", (req, res) => { res.render("contact"); });
router.get("/signin", (req, res) => { res.render("signin");});
router.get("/menu", (req, res) => { res.render("menu");});
router.get("/index", (req, res) => { res.render("index");});
router.get("/services", (req, res) => { res.render("services");});




module.exports = router;