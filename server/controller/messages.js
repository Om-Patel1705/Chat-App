const pool = require("../config/db");

const addMessage = async (req, res) => {
  var { content, chatId, sender } = req.body;

  // for(var i=0;i<content.length-1 ;i++){
  //   if(content[i]=="\\" && content[i+1]==`'` ){content[i]=`'`;}
  // }

  content = content.replace(/\\'/g, "''");
  console.log("reached addMessage");
  console.log(content);

  try {
    const msgid = await pool.query(
      `insert into messages (content,senderid,time,chatid)  values('${content}',${sender._id},CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata',${chatId.chatid}) returning id`
    );
    const data = await pool.query(
      `SELECT id, content, senderid, to_char(time AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata', 'HH24:MI') AS time, chatid
FROM messages
WHERE id = ${msgid.rows[0].id};`
    );

    await pool.query(
      `update chat set latestmessage=${msgid.rows[0].id} where chatid=${chatId.chatid}`
    );
    //  console.log(chatId);
    res.json(data.rows[0]);
  } catch (error) {
    console.log(error);
    // res.json(error);
  }
};
const allMessages = async (req, res) => {
  console.log("reached allMessages");
  const { chatid } = req.body.selectedChat;
  try {
    const data = await pool.query(
      // `select * from (select * from messages where chatid=${chatid} ) as r1 join users as u on u.id=r1.senderid ORDER BY time`
      `select * from (SELECT id, content, senderid, to_char(time AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata', 'HH24:MI') AS time, chatid from messages where chatid=${chatid} ) as r1 join users as u on u.id=r1.senderid ORDER BY time`
    );

    //  console.log(chatid);

    res.json(data.rows);
    console.log(data.rows);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

module.exports = { addMessage, allMessages };
