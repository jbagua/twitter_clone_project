const { Router } = require("express");
const User = require("../models/User");
const Tweet = require("../models/Tweet");
const router = Router();

//news feed data
let newsFeedData = {
  tweetData: "",
  userid: "",
};

let data = {
  message: "",
};

//create new user
router.post("/createUser", async (req, res, err) => {
  console.info("\n.............POST:/createUser..............\n");

  try {
    let { username, password } = req.body;
    let user = await User.create({
      username: username,
      password: password,
    });

    if (user) {
      data.message = "Account Created successfully Please login here";
      res.status(201).redirect("/");
    } else {
      res.status(500);
      console.error("\nERROR--->POST:createUser", err, "\n");
    }
  } catch (error) {
    res.status(500);
    console.error("\nCatch POST:createUser", error, "\n");
  }
});

//login
router.post("/login", async (req, res, next) => {
  try {
    console.info(
      "\n................POST:/login....&& load newsFeeds............\n"
    );

    let { username, password } = req.body;

    let whereUser = {
      username: username,
      password: password,
    };

    console.info("\nReq.body---->", req.body, "\n");

    let user = await User.findOne({
      where: whereUser,
    });

    //if user exist
    if (user) {
      console.log("\nUser from db---->", user, "\n");
      console.log("\nUser id from db ---->", user.dataValues.id, "\n");

      let tweets = await Tweet.findAll({
        include: User,
        order: [["id", "DESC"]],
      });
      let tweetData = { tweets };

      //display news feed
      console.info("\nString Tweet data", tweets, "\n");

      if (tweetData) {
        newsFeedData.tweetData = tweetData;
        newsFeedData.userid = user.dataValues.id;
        res.status(200).render("pages/home", newsFeedData);
      } else {
        res.status(404);
        console.error("\nELSE::ERROR::Tweet data not found", "\n");
      }
    } else {
      data.message = "Invalid Username or Password";
      res.redirect("/");
    }
  } catch (error) {
    res.status(500);
    console.error("\nCATCH::Tweet && login", error, "\n");
  }
});

//create tweets
router.post("/makeTweet", async (req, res, next) => {
  try {
    console.info("\n..........POST:/makeTweet...........\n");

    let tweet = await Tweet.create({
      content: req.body.content,
      timeCreated: new Date(),
      UserId: req.body.UserId,
    });

    if (tweet) {
      res.status(201).redirect("/home");
      next();
    } else {
      res.status(500).send("Error Creating Tweet");
    }
  } catch (error) {
    res.status(500).end();
    console.error("\n CATCH: POST:/makeTweet-->", error, "\n\r");
  }
});

module.exports = router;
