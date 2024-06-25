const pool = require("../config/db");

const addMessage = async (req, res) => {
  const { content, chatId, sender } = req.body;

  console.log("reached addMessage");

  try {
    const msgid = await pool.query(
      `insert into messages (content,senderid,time,chatid)  values('${content}',${sender._id},current_timestamp,${chatId.chatid}) returning id`
    );
    const data = await pool.query(
      `select * from messages where id=${msgid.rows[0].id}`
    );

    await pool.query(
      `update chat set latestmessage=${msgid.rows[0].id} where chatid=${chatId.chatid}`
    );
    //  console.log(chatId);
    res.json(data.rows[0]);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};
const allMessages = async (req, res) => {
  console.log("reached allMessages");
  const { chatid } = req.body.selectedChat;
  //  console.log(chatid);
  try {
    const data = await pool.query(
      `select * from (select * from messages where chatid=${chatid} ) as r1 join users as u on u.id=r1.senderid ORDER BY time`
    );
    res.json(data.rows);
   console.log(data.rows);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

module.exports = { addMessage, allMessages };
