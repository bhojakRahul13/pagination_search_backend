const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const usersRouter = require("./routes/usersRouter");

mongoose.connect(
  '"mongodb://localhost:27017/management_system_serch_pagin',
  { useNewUrlParser: true },
  (err) => {
    if (!err) {
      console.log("mongo connect successfully.");
    } else {
      console.log("ERROr in db:" + err);
    }
  }
); //db name management_system_serch_pagintion

let app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use("/", usersRouter);

app.get("/api/react", (req, res) => {
  res.status(200).json({
    message: "Hey its from backend",
  });
});

app.listen(4000, () => {
  console.log("Server start in port : 4000");
});
