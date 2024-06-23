const express = require("express");
const protect = require("../middleWare/authMiddleware");
const { addMessage ,allMessages} = require("../controller/messages");


const router = express.Router();

 router.route('/').post(protect,addMessage);
 router.route('/all').post(protect,allMessages);



module.exports=router;