const express = require("express");
const router = express.Router();
const { authJwt } = require("../middleware");
const { signin,getUserList } = require("../controllers/auth.controller");

router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.get("/signin", signin);

router.get('/users',[authJwt.verifyToken], getUserList);

module.exports = router;
