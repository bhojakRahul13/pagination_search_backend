const express = require("express");
const router = express();

const User = require("../models/users.model");
const e = require("express");
const { table, log } = require("console");
const { update } = require("../models/users.model");
const { text } = require("body-parser");

// Get login page
// router.get("/", (req, res) => {
//   // res.render("login");
// });

router.post("/", (req, res) => {
  //res.json(req.body);
  const email = req.body.Email;
  const password = req.body.Password;

  User.findOne({ $and: [{ email: email }, { password: password }] }, function (
    err,
    user
  ) {
    if (user) {
      console.log(err);
      //  res.redirect("/display");
      res.send({ msg: "login Successfully " });
    } else {
      res.send({ msg: "Incorrect email or Password !" });
    }
    res.end();
  });
});

// router.get("/reg", (req, res) => {
//   //  console.log("register",req.body)//
//   res.render("register", {
//     message: "",
//   });
// });

// router.get("/table", (req, res) => {
//   res.render("table", {
//     title: "crud opration using NODEJS / Express js/ mongodb",
//   });
// });

//register form with check  emial  query
router.post("/reg", async (req, res) => {
  console.log("called api", req.body);

  const userData = await User.findOne({
    email: req.body.Email,
  });

  console.log("data", userData);

  if (userData) {
    // res.render("register", {
    //   message: "already exist",
    // });
    res.json({ msg: "user already exist go for login" });
    return;
  }
  const user = new User({
    name: req.body.Name,
    email: req.body.Email,
    password: req.body.Password,
  });
  user.save();
  res.json({ msg: "user created" });
  // res.redirect("/display");
});

//User Searching api and pagination
router.get("/display", (req, res) => {
  let searchFields1 = req.query.name;
  let searchFields2 = req.query.email;
  let { pageNo } = req.query;

  if (pageNo === undefined) {
    pageNo = 1;
  }
  if (searchFields1 === undefined) {
    searchFields1 = "";
  }

  if (searchFields2 === undefined) {
    searchFields2 = "";
  }

  const limit = 4;

  const options = {
    offset: (pageNo - 1) * limit,
    limit: limit,
  };
  User.paginate(
    {
      $and: [
        { name: { $regex: searchFields1, $options: "$i" } },
        { email: { $regex: searchFields2, $options: "$j" } },
      ],
    },
    options,
    (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send({
          msg: "display ",
          users: result.docs,
          total_data: result.totalDocs,
          options,
        });
      }
    }
  );
});

//retrive data from
router.get("/edit/:id", function (req, res) {
  console.log("called", req.params.id);
  User.findById(req.params.id, function (err, users) {
    // if (err) {
    //   console.log(err);
    // } else {
    //   res.render("update", {
    //     users: users,
    //   });
    // } okay now
    res.send({ msg: "update", users: users });
  });
});

//update data from id in form
router.post("/edit/:id", function (req, res) {
  console.log("update call" + req.params.id);

  const user = {
    name: req.body.Name,
    email: req.body.Email,
    password: req.body.Password,
  };

  User.findByIdAndUpdate(req.params.id, user, function (err) {
    res.send({ msg: "user update" });
    if (err) {
      console.log("req.params.id");
      //res.redirect("edit/" + req.params.id);
    } else {
      //res.redirect("../display");
    }
  });
});

router.get("/delete/:id", function (req, res) {
  console.log(req.params.id);
  User.findOneAndDelete({ _id: req.params.id }, function (err, users) {
    res.json("delete succ");

    // if (err) {
    //   res.redirect("../display");
    // } else {
    //   res.redirect("../display");
    // }
  });
});

//Get ALL users  list in url page with Pagination
// router.get("/display", async function (req, res) {
//   const searchFields1 = req.query.name;
//   const searchFields2 = req.query.email;
//   const { pageNo } = req.query;
//   const limit = 4;

//   const options = {
//     offset: (pageNo - 1) * limit,
//     limit: limit,
//   };

//   await User.paginate({}, options, (err, result) => {
//     if (err) {
//       res.send(err);
//     } else {
//       res.send({
//         msg: "display ",
//         users: result.docs,
//         total_data: result.totalDocs,
//         options,
//       });
//     }
//   });
// });

//User Searching api
// router.get("/search", (req, res) => {
//   const searchFields1 = req.query.name;
//   const searchFields2 = req.query.email;
//   User.find({
//     $and: [
//       { name: { $regex: searchFields1, $options: "$i" } },
//       { email: { $regex: searchFields2, $options: "$j" } },
//     ],
//   })
//     .then((result) => {
//       console.log(result);
//       res.status(200).json({
//         result,
//       });
//     })
//     .catch((err) => {
//       res.status(500).json({
//         error: err,
//       });
//     });
// });

module.exports = router;
