const express = require("express");
const protect = require("../middleWare/authMiddleware");
const { addMessage ,allMessages,deleteMessage} = require("../controller/messages");


const router = express.Router();

 router.route('/').post(protect,addMessage);
 router.route('/all').post(protect,allMessages);
 router.route('/delete').post(protect,deleteMessage);


module.exports=router;
