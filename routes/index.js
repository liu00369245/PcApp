var express = require('express');
//后台
var http = require('ykt-http-client');
//上传图片
var multiparty = require('multiparty');
var util = require("util");
var router = express.Router();

//登录
router.post("/login", (req, res) => {
  let obj = {
    acc: req.body.acc,
    pwd: req.body.pwd,
    findType: "exact"
  }
  http.post("127.0.0.1:3333/admin/find", obj).then((data) => {
    if (data.length == 1) {
      req.session.acc = data[0].acc;
      res.redirect("../index.html");
    }
    else {
      res.redirect("../login.html?isLogin");
    }
  })
})
//判断是否登录成功
router.get("/isLogin", (req, res) => {
  if (req.session.acc) {
    res.send(req.session.acc)
  }
  else {
    res.send("");
  }
})
//退出登录
router.get("/outLogin", (req, res) => {
  delete req.session.acc
  res.send("");
})

module.exports = router;
