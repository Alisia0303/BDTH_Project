let express = require("express");
let mongoose = require("mongoose");
let bodyParser = require("body-parser");
let apiRoutes = require("./routes");
const path = require("path");
let app = express();
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use("/frontend", express.static("../frontend"));

mongoose.connect("mongodb://localhost/Road", {
  useNewUrlParser: true,
});
var db = mongoose.connection;

// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/";

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("Road");
//   (dbo.listCollections().toArray())
//   .then(res => console.log(res))
//   dbo.collection("LawsDescription").find({}).toArray(function(err, result) {
//     if (err) throw err;
//     console.log("Result", result);
//     db.close();
//   });
// });

// Add check for db connection
if (!db) console.log("Error connecting db");
else console.log("Db connected successfully");
console.log("Collections", db.collections);

// Setup server port
var port = process.env.PORT || 3001;
app.get("/", (req, res) => {
  res.send("Hello, this is BDTH Application endpoints.");
});
app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend", "index.html"));
});
app.use("/api", apiRoutes);
// Launch app to listen to specified port
app.listen(port, function () {
  console.log("Running Application on port " + port);
});
