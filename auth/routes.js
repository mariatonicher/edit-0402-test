const express = require("express");
const router = express.Router();
const schemas = require("./schemas");
const services = require("./services");
const auth = require("/middleware");

//task-4 - https://medium.com/@developerom/jwt-authentication-using-node-js-4eff30bd2785
router.get("/polls", auth, (req, res) => {
  res.json({
    message: "You are authorized to access this protected resource.",
  });
});

router.post("/signin", async (req, res) => {
  const { error, value } = schemas.signinSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ error: "invalid body", details: error.details });
  }

  const user = await services.findUserByEmail(value.email);
  if (!user) {
    return res.status(401).json({ error: "unauthorized" });
  }

  const isValidPwd = await services.validatePassword(
    value.password,
    user.password
  );
  if (!isValidPwd) {
    return res.status(401).json({ error: "unauthorized" });
  }

  const token = services.generateAccessToken(user._id);

  res.status(200).json({ result: "ok", token });
});

router.post("/signup", async (req, res) => {
  const { error, value } = schemas.signupSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ error: "invalid body", details: error.details });
  }

  const user = await services.findUserByEmail(value.email);
  if (user) {
    return res.status(400).json({ error: "email already in use" });
  }

  const newUser = await services.createUser(value);
  if (!newUser) {
    return res.status(500).json({ error: "unexpected server error" });
  }

  res.status(200).json({
    id: newUser._id,
    email: newUser.email,
    name: newUser.name,
  });
});

module.exports = router;
