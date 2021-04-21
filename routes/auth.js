const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"] || req.headers["authorization"];

  if (token) {
    jwt.verify(token, "chor", (err, decoded) => {
      if (err) {
        res.status(403).json({ err });
      }

      if (decoded) {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.status(403).json({ msg: "Token not provided" });
  }
};

const signToken = (req, res, next) => {
  const { email, password } = req.body;

  //below should be fetched from DB

  let checkEmail = "admin@email.com";
  let checkPassword = "1234";

  if (email === checkEmail && password === checkPassword) {
    let token = jwt.sign({ email: email }, "chor", { expiresIn: "1h" });
  }
};
