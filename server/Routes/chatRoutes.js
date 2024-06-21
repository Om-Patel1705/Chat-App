const express = require("express");
const searchUsers = require("../controller/searchUsers");
const protect = require("../middleWare/authMiddleware");
const {accessChat,fetchChats, createGroup, renameGroup, addToGroup, removeFromGroup, listout,isg} = require("../controller/accessChat");

const router = express.Router();

 router.route('/').post(protect,accessChat);
 router.route('/load').post(protect,fetchChats);
 router.route('/group').post(protect,createGroup);
 router.route('/rename').put(protect,renameGroup);
 router.route('/groupadd').put(protect,addToGroup);
 router.route('/groupremove').put(protect,removeFromGroup);


router.route("/search").post(protect,searchUsers);
router.route("/listout").post(protect,listout);
router.route("/isgroup").post(protect,isg);


module.exports=router;