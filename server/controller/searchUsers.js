const pool = require("../config/db");

const searchUsers = async (req, res) => {
 console.log("Reach serachUsers")
  // console.log(req.body);

  const user = await pool.query(
    ` select * from (select id,username,email,pic from users where username like '${req.body.searchUser}%') as r1 where id != ${req.body.user._id}`
  );
  // console.log(user.rows);
  res.json(user.rows);
};

module.exports = searchUsers;
 