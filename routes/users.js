var express = require('express');
var router = express.Router();
var http = require('ykt-http-client');

//请求表格数据
router.get('/getUser', (req, res) => {
  req.query.page = Number(req.query.page);
  req.query.rows = Number(req.query.rows);
  http.get("127.0.0.1:3333/users/find", req.query).then((data) => {
    res.send(data);
  })
})
//添加
router.get("/usersAdd", (req, res) => {
  http.get("127.0.0.1:3333/users/add", req.query).then((data) => {
    res.send(data);
  })
})
//删除
router.get("/usersDel", (req, res) => {
  let proam = req.query;
  if (req.query.ids.length == 1) {
    proam = { _id: req.query.ids[0] }
  }
  http.get("127.0.0.1:3333/users/del", proam).then((data) => {
    res.send(data);
  })
})
//修改
router.get("/usersEdit", (req, res) => {
  http.get("127.0.0.1:3333/users/update", req.query).then((data) => {
    res.send("");
  })
})

module.exports = router;
