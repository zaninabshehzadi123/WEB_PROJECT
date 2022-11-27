
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const control = require("../controllers/controller");
const {Authentication} = require("../middlewares/auth");
const cookieParser = require("cookie-parser");
const session = require('express-session');
router.use(cookieParser());
router.use(
    session({
        secret: "@@11223344@@",
        resave: false,
        saveUninitialized: true,
        cookie: { path: "/", httpOnly: true, secure: false, maxAge: 24 * 60 * 60 * 1000 },
    })
);



router.get("/contact", (req, res) => { res.render("contact"); });
router.get("/signin", (req, res) => { res.render("signin");});
router.get("/signup", (req, res) => { res.render("signup");});
router.get("/menu", (req, res) => { res.render("menu");});
router.get("/index", (req, res) => { res.render("index");});
router.get("/services", (req, res) => { res.render("services");});

router.get("/billpay", (req, res) => { res.render("billpay");});


module.exports = router;


router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get("/", (req, res) => { res.render("index"); });
router.get("/signin", (req, res) => { res.render("signin");});

router.post("/signIn", control.signIn);


router.get("/signUp", (req, res) => { res.render("signup"); });
router.post("/signUp", control.signUp);

router.get("/dashboard", Authentication, control.dashboard);

router.get("/logout", (req,res)=>{
    req.session.admin = null;
    req.cookies.CurrentRole = "";
    res.redirect("/");
})

router.get("/logoutUser", (req,res)=>{
    req.session.user = null;
    req.cookies.CurrentRole = "";
    res.redirect("/");
})

module.exports = router;