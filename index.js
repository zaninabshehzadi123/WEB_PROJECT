const express = require("express");
const app = express();
const ejs = require("ejs");
(path = require("path")), (mysql = require("mysql"));
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });


var fs = require('fs');
var pdf = require('html-pdf-node');
//var html = fs.readFileSync('./test/businesscard.html', 'utf8');
var options = { format: 'A4' };




const con = mysql.createConnection({
  host: "localhost",
  user: "ayrish123",
  password: "123",
  
  database: "final",
});
con.connect(function (err) {
  if (err) throw err;
  console.log("connected");
});
app.set("view engine", "ejs");
// static files
app.use(express.static(path.join(__dirname, "public")));

// starting the server
app.listen(5002, () => {
  console.log(`server on port 5002`);
});


app.get("/", (req, res) => {
  con.query("SELECT * FROM products", function (err, result) {
    if (err) throw err;
    console.log(result);
    res.render("index", { data: result });
  });
});

app.get("/addnew", (req, res) => {
  res.render("addnew");
});

app.post("/addnew", upload.single("profile1"), (req, res) => {
  if (!req.file) {
    return req.statusCode(404).send("No File Recieved!");
  }

  const name = req.body.name1;
  const ID = req.body.email1;
  const des = req.body.password1;
  const type = req.body.qual;
  const address = req.body.city;
  const profilepicName = req.file.originalname;

  const Query = `INSERT INTO products VALUES ('${name}','${ID}','${des}','${type}','${address}','${profilepicName}' )`;
  con.query(Query, function (err, result) {
    if (err) throw err;
    res.redirect("/");
  });
});

app.post("/update/:id", upload.single("profile1"), (req, res) => {
  if (!req.file) {
    return req.statusCode(404).send("No File Recieved!");
  }

  const name = req.body.name1;
  const Id = req.body.email1;
  
  const type = req.body.qual;
  const city = req.body.city;
  const profilepicName = req.file.originalname;


  const Query = `Update products set name='${name}', email='${Id}',qual='${type}', city='${city}', pic='${profilepicName}' where email='${Id}' `;
  con.query(Query, function (err, result) {
    if (err) throw err;
    res.redirect("/");
  });
});

app.get("/update/:id", (req, res) => {
  const mail = req.params.id;
  con.query(
    `SELECT * FROM products where email='${mail}'`,
    function (err, result) {
      if (err) throw err;
      console.log(result);

      res.render("update", { data: result });
    }
  );
});

app.get("/del/:id", (req, res) => {
  const mail = req.params.id;
  con.query(`Delete FROM products where email='${mail}'`, function (err, result) {
    if (err) throw err;
    console.log(result);

    res.redirect("/");
  });
});



app.get("/printData", function(req, res)
{
    con.query(`Select * From products`, function(err, result){
        if(err) throw err;
        res.render('printData',{result}, function(err, html){
            if(err) throw err;


            pdf.create(html, options).toFile("public/allDoc.pdf", function(err, result){
                if(err) throw err;
                else{
                    var alldocfile= fs.readFileSync("public/allDoc.pdf");
                    res.header("content-type","application/pdf");
                    res.send(alldocfile);
                }
                
            })
        })
    })
})




app.get("/cooked", (req, res) => {
  con.query("SELECT * FROM products Where city='Cooked' ", function (err, result) {
    if (err) throw err;
    console.log(result);
    res.render("index", { data: result });
  });
});


app.get("/baked", (req, res) => {
  con.query("SELECT * FROM products  Where city='baked' ", function (err, result) {
    if (err) throw err;
    console.log(result);
    res.render("index", { data: result });
  });
});

app.get("/fried", (req, res) => {
  con.query("SELECT * FROM products  Where city='fried' ", function (err, result) {
    if (err) throw err;
    console.log(result);
    res.render("index", { data: result });
  });
});


app.post("/searchByName", (req, res) => {
  console.log(req.body.docName);
  // let name = req.body.docName;
  //console.log(req.params.name1);
  con.query(`SELECT * FROM products where name='${req.body.docName}'`, function (err, result) {
    if (err) throw err;
    console.log(result);  
    res.render("index", { data: result });
  });
});


app.get('/products', (req,res)=>{

   const countQ = "SELECT COUNT(*) FROM Products";
    con.query(countQ, function (err, result) {
        if (err) throw err;

        let dataCount = result[0]["COUNT(*)"];
        let pageNo = req.query.page ? req.query.page : 1;
        let dataPerPages = req.query.data ? req.query.data : 2;
        let startLimit = (pageNo - 1) * dataPerPages;
        let totalPages = Math.ceil(dataCount / dataPerPages);

        const Query = `SELECT * FROM Products LIMIT ${startLimit}, ${dataPerPages}`;
        con.query(Query, function (err, result) {
            if (err) throw err;
            res.render("pagedData", {
                data: result,
                pages: totalPages,
                CurrentPage: pageNo,
                lastPage: totalPages
            });
        })
    })

});
