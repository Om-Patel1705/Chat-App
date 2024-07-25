
const pool = require("../config/db");

const accessChat = async (req, res) => {
  const {receiveruser,user,chats} = req.body;

  // console.log("userID");
  // console.log(receiveruser);
  // console.log("userID");

  req.body.user.id=req.body.user._id;
  req.body.user.username=req.body.user.name;

  
  try {

    const msgid = await pool.query(
      `insert into messages (senderid,content,time) values (${req.body.user._id},'${req.body.user.name} has started this chat',CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')  RETURNING id;`
    );

      // console.log(msgid.rows[0]);


    const returnChat = await pool.query(
      `insert into chat (chatname,isgroup,latestmessage) values ('One-to-one chat',false,${msgid.rows[0].id})  RETURNING chatid;`
    );

    // const returnChat = await pool.query(
    //   `insert into chat (chatname,isgroup,groupadmin,latestmessage) values ('${req.body.name}',true,${req.body.admin._id},${msgid.rows[0].id})  RETURNING chatid;`
    // );

    
    
    const newChat = returnChat.rows[0].chatid;
    // console.log(newChat);
   
    var users = [req.body.user , req.body.receiveruser];
    var r = "";
    for (var i = 0; i < users.length; i++) {
      if(i==0){
        r = r + `(${users[i]._id},${newChat}),`;
      }
      else if (i != users.length-1) {
        r = r + `(${users[i].id},${newChat}),`;
      } else {
        r = r + `(${users[i].id},${newChat})`;
      }
    }



    // console.log(r);
 

    await pool.query(`insert into chat_users_junction (id,chatid) values ${r}`);
    await pool.query(`update messages set chatid=${newChat} where id=${msgid.rows[0].id}`);

    const data = await pool.query(`SELECT u2.username,r1.* from (select j.chatid,chatname,isgroup,groupadmin,latestmessage,senderid as id, content,time from chat_users_junction as j natural join chat as c right join messages as m on m.id=c.latestmessage  where j.id=${req.body.user.id} and j.chatid=${newChat}) as r1 NATURAL join users as u2 `);

    data.rows[0].users = users;

    // console.log(data.rows);

    return res.json(data.rows[0]);
  } catch (error) {
    console.log(error);
    return res.json(error);
  }

  // try {
  //   // Check if there's an existing chat between the two users
  //   const data = await pool.query(
  //     `
  //           WITH r1 AS (
  //               SELECT chatid 
  //               FROM chat_users_junction 
  //               WHERE id = $1
  //           ), 
  //           r2 AS (
  //               SELECT chatid 
  //               FROM chat_users_junction 
  //               WHERE id = $2
  //           )
  //           SELECT *  
  //           FROM r1 
  //           INTERSECT 
  //           SELECT *   
  //           FROM r2;
  //       `,
  //     [req.body.user._id, userID]
  //   );

  //   if (data.rows.length === 0) {
  //     const newChat = await pool.query(`
  //               INSERT INTO chat (chatname, isgroup) 
  //               VALUES ('1to1chat', false) 
  //               RETURNING chatid;
  //           `);

  //     const chatId = newChat.rows[0].chatid;

  //     await pool.query(
  //       `
  //               INSERT INTO chat_users_junction (id, chatid) 
  //               VALUES ($1, $2), ($3, $2);
  //           `,
  //       [req.user.id, chatId, userID]
  //     );

  //     res.json({ message: "New chat created", success: true, chatId });
  //   } else {
  //     // Chat already exists
  //     res.json({
  //       message: "Chat already exists ",
  //       success: true,
  //       chatId: data.rows[0].chatid,
  //     });
  //   }
  // } catch (err) {
  //   console.error(err);
  //   res.status(500).json({ success: false, error: "Internal server error" });
  // }
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
    // console.log(data.rows);
    return res.status(200).json(data.rows);
  } catch (error) {
    console.log(error);
    return res.status(400).json("Something went wrong");
  }
};

const createGroup = async (req, res) => {


  console.log("reached at createGroup");

  req.body.admin.id=req.body.admin._id;
  req.body.admin.username=req.body.admin.name;
  var users = req.body.users;
  users.push(req.body.admin);

  var temp = users[0];
  users[0] = users[users.length - 1];
  users[users.length - 1] = temp;


  try {

    const msgid = await pool.query(
      `insert into messages (senderid,content,time) values (${req.body.admin._id},'${req.body.admin.name} has created this group',CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')  RETURNING id;`
    );

      // console.log(msgid.rows[0]);


    const returnChat = await pool.query(
      `insert into chat (chatname,isgroup,groupadmin,latestmessage) values ('${req.body.name}',true,${req.body.admin._id},${msgid.rows[0].id})  RETURNING chatid;`
    );

    // const returnChat = await pool.query(
    //   `insert into chat (chatname,isgroup,groupadmin,latestmessage) values ('${req.body.name}',true,${req.body.admin._id},${msgid.rows[0].id})  RETURNING chatid;`
    // );

    
    
    const newChat = returnChat.rows[0].chatid;
    // console.log(newChat);
   
    var r = "";
    for (var i = 0; i < users.length; i++) {
      if(i==0){
        r = r + `(${users[i]._id},${newChat}),`;
      }
      else if (i != users.length-1) {
        r = r + `(${users[i].id},${newChat}),`;
      } else {
        r = r + `(${users[i].id},${newChat})`;
      }
    }

    // console.log(r);
 

    await pool.query(`insert into chat_users_junction (id,chatid) values ${r}`);
    await pool.query(`update messages set chatid=${newChat} where id=${msgid.rows[0].id}`);



    const data = await pool.query(`SELECT u2.username,r1.* from (select j.chatid,chatname,isgroup,groupadmin,latestmessage,senderid as id, content,time from chat_users_junction as j natural join chat as c right join messages as m on m.id=c.latestmessage  where j.id=${req.body.admin.id} and j.chatid=${newChat}) as r1 NATURAL join users as u2 `);

    data.rows[0].users = users; 

    // console.log(data.rows[0]);

    return res.json(data.rows[0]);
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
};

const renameGroup = async (req, res) => {
  const { oldchat, newName } = req.body;

  console.log("Rename");

  if (!oldchat.chatid || !newName) {
    console.log("Please fill all the feiled");
    return res.status(400).json({ message: "Please fill all the feiled" });
  }
  try {
    const updatedName = await pool.query(
      `update chat set chatname = '${newName}' where chatid=${oldchat.chatid} returning chatname`
    );

    const updatedChat = await pool.query(
      `select * from chat where chatid=${oldchat.chatid}`
    );

    updatedChat.rows[0].users = oldchat.users;
    // console.log(updatedChat.rows[0]);
    res.status(200).json(updatedChat.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Name update is failed" });
  }
};

const addToGroup = async (req, res) => {
  // const { chatID, userID } = req.body;
  const chatID = req.body.oldchat.chatid;
  const { userID } = req.body;

  // console.log(req.body);

  if (!chatID || !userID) {
    console.log("Fill All the feileds");
    return res.status(400).json({ message: "Please fill all the feiled" });
  }

  try {  
    const newlyAdded = await pool.query(
      `insert into chat_users_junction values (${userID},${chatID}) returning id`
    );

    const newUser = await pool.query(`select * from users where id=${userID}`);

    //console.log(newlyAdded.rows[0]);
    req.body.oldchat.users.push(newUser.rows[0]);

    return res.status(200).json(req.body.oldchat);
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Something went wrong User id not added",
      error: error,
    });
  }
};

const removeFromGroup = async (req, res) => {
  const chatID = req.body.oldchat.chatid;
  const userID = req.body.userId;

  if (!chatID || !userID) {
    console.log("Fill All the feileds");
    return res.status(400).json({ message: "Please fill all the feiled" });
  }
  try {
    const userRemoved = await pool.query(
      `delete from chat_users_junction where id=${userID} and chatid=${chatID} returning id`
    );

    const arr = req.body.oldchat.users.filter((l) => l.id !== userID);

    // console.log(arr);
    req.body.oldchat.users = arr;
    // console.log(userRemoved.rows[0]); 
    return res.status(200).json(req.body.oldchat);
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Something went wrong User id not removed",
      error: error,
    });
  }
};

const fun = async (row) => {
  return await pool.query(
    `SELECT * FROM chat_users_junction as j join users as u on j.id = u.id where j.chatid=${row.chatid}`
  );
};
const listout = async (req, res) => {
  const chatID = req.body;

   console.log("Reached at listout");
  try {
    const list = await pool.query(
      `SELECT u2.username,r1.* from (select j.chatid,chatname,isgroup,groupadmin,latestmessage,senderid as id, content,time from chat_users_junction as j natural join chat as c join messages as m on m.id=c.latestmessage  where j.id=${chatID.user._id}) as r1 NATURAL join users as u2 order by time desc`
    );
  

    for (const row of list.rows) {
      const user = fun(row);
      row.users = (await user).rows;
    }

    // console.log("||");
    // list.rows.forEach((row) => {
    //   console.log(row);
    // });
    // console.log("||");

    // console.log("List of users:");
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
  // console.log(chatid);
  try {
    const list = await pool.query(
      `select id,username from chat_users_junction natural join users where chatid=${chatid}`
    );
    // console.log(list.rows);
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
