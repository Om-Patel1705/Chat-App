const pool = require("../config/db");
const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  console.log("reach at protect");
  // console.log(req.body);
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      //decodes token id
      const decoded = jwt.verify(token,"hello");
      //   res.json(decoded);
      const temp = await pool.query(
        `select * from users where id = '${decoded.id}'`
      );
      req.user = temp.rows[0];
      console.log("decoded");

      next(); 
    } catch (error) {
      console.log(error);
      res.status(401).json({ mesasge: "Not Authorized, token failed" });
      return;
    }
  }

  if (!token) {
    res.status(401).json({ mesasge: "No token" });
    return;
  }
};

module.exports = protect;
