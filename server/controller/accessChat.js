const pool = require("../config/db");

const accessChat = async (req, res) => {
  const userID = req.body;

  console.log("userID");
  console.log(userID);
  console.log("userID");

  try {
    // Check if there's an existing chat between the two users
    const data = await pool.query(
      `
            WITH r1 AS (
                SELECT chatid 
                FROM chat_users_junction 
                WHERE id = $1
            ), 
            r2 AS (
                SELECT chatid 
                FROM chat_users_junction 
                WHERE id = $2
            )
            SELECT *  
            FROM r1 
            INTERSECT 
            SELECT *   
            FROM r2;
        `,
      [req.body.user._id, userID]
    );

    if (data.rows.length === 0) {
      const newChat = await pool.query(`
                INSERT INTO chat (chatname, isgroup) 
                VALUES ('1to1chat', false) 
                RETURNING chatid;
            `);

      const chatId = newChat.rows[0].chatid;

      await pool.query(
        `
                INSERT INTO chat_users_junction (id, chatid) 
                VALUES ($1, $2), ($3, $2);
            `,
        [req.user.id, chatId, userID]
      );

      res.json({ message: "New chat created", success: true, chatId });
    } else {
      // Chat already exists
      res.json({
        message: "Chat already exists ",
        success: true,
        chatId: data.rows[0].chatid,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const fetchChats = async (req, res) => {
  try {
    const userID = req.body;

    // console.log("userID");
    // console.log(userID);
    // console.log("userID");
    const data = await pool.query(
      `select c.* from  chat_users_junction as cuj  join chat as c on c.chatid = cuj.chatid  where id=${req.body._id}`
    );
    console.log(data.rows);
    return res.status(200).json(data.rows);
  } catch (error) {
    console.log(error);
    return res.status(400).json("Something went wrong");
  }
};

const createGroup = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).json({ message: "Please Fill all the feilds" });
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .json({ message: "Require atleast 2 users to create a chat" });
  }

  try {
    const returnChat = await pool.query(
      `insert into chat (chatname,isgroup,groupadmin) values ('${req.body.name}',true,${req.user.id})  RETURNING chatid;`
    );
    const newChat = returnChat.rows[0].chatid;
    console.log(newChat);
    var r = "";
    for (var i = 0; i <= users.length; i++) {
      if (i != users.length) {
        r = r + `(${users[i]},${newChat}),`;
      } else {
        r = r + `(${req.user.id},${newChat})`;
      }
    }

    await pool.query(`insert into chat_users_junction (id,chatid) values ${r}`);

    return res.json(newChat);
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
};

const renameGroup = async (req, res) => {
  const { chatId, newName } = req.body;

  if (!chatId || !newName) {
    console.log("Please fill all the feiled");
    return res.status(400).json({ message: "Please fill all the feiled" });
  }
  try {
    const updatedName = await pool.query(
      `update chat set chatname = '${newName}' where chatid=${chatId} returning chatname`
    );
    console.log(updatedName.rows[0]);
    res.status(200).json({
      message: "Group name is successfully updated",
      newName: `${updatedName.rows[0].chatname}`,
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Name update is failed" });
  }
};

const addToGroup = async (req, res) => {
  const { chatID, userID } = req.body;

  if (!chatID || !userID) {
    console.log("Fill All the feileds");
    return res.status(400).json({ message: "Please fill all the feiled" });
  }

  try {
    const newlyAdded = await pool.query(
      `insert into chat_users_junction values (${userID},${chatID}) returning id`
    );

    console.log(newlyAdded.rows[0]);
    return res.status(200).json({
      message: `New User successfully added`,
      newUser: newlyAdded.rows[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Something went wrong User id not added",
      error: error,
    });
  }
};

const removeFromGroup = async (req, res) => {
  const { chatID, userID } = req.body;

  if (!chatID || !userID) {
    console.log("Fill All the feileds");
    return res.status(400).json({ message: "Please fill all the feiled" });
  }
  try {
    const userRemoved = await pool.query(
      `delete from chat_users_junction where id=${userID} returning id`
    );

    console.log(userRemoved.rows[0]);
    return res.status(200).json({
      message: `User removed successfully`,
      newUser: userRemoved.rows[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Something went wrong User id not removed",
      error: error,
    });
  }
};

const listout = async (req, res) => {
  const chatID  = req.body;
  // console.log(chatID);
  try {
    const list = await pool.query(
      `select * from chat_users_junction as j natural join chat as c where j.id=${chatID.user._id}`
    );
    // console.log("List of users:");
    // list.rows.forEach((row) => {
    //   console.log(row);
    // });
    res.status(200).json(list.rows);


   
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Something went wrong User id not removed",
      error: error,
    });
  }
};

const isg = async (req, res) => {
  const chatid = req.body.chatid;
  console.log(chatid);
  try {
    const list = await pool.query(
      `select id,username from chat_users_junction natural join users where chatid=${chatid}`
    );
   console.log(list.rows);
    res.status(200).json(list.rows);


   
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Something went wrong",
      error: error,
    });
  }
};


module.exports = {
  accessChat,
  fetchChats,
  createGroup,
  renameGroup,
  addToGroup,
  removeFromGroup,
  listout,
  isg,
};
