//资讯管理路由
var express = require('express');
//后台
var http = require('ykt-http-client');
//上传图片
var multiparty = require('multiparty');
var util = require("util");
var router = express.Router();

// 主页表格
router.get('/getLike', function (req, res) {
  http.get('127.0.0.1:3333/consult/find', req.query).then(function (data) {
    res.send(data);
  })
});

/* 上传*/
router.post('/upFile', function (req, res) {
  //生成multiparty对象，并配置上传目标路径
  var form = new multiparty.Form({ uploadDir: './public/img/consult' });  //文件路径可以修改，如果修改记得和下面的路径保持一致

  //上传完成后处理
  form.parse(req, function (err, fields, files) {

    var filesTmp = JSON.stringify(files, null, 2);

    if (err) {
      console.log('parse error: ' + err);
    } else {
      console.log('parse files: ' + filesTmp);
      var files = files.inputFile;
    }
    //发送第一张图片的信息
    let str = [];
    let newPath = [];
    for (let i of files) {
      str.push(i.path);
    }
    for (let j of str) {
      newPath.push(j.replace(/public/, ''))
    }

    res.send(newPath);    //发送消息回去
  });
});



// 增加
router.get('/addLike', function (req, res) {
  let newpicture = [];
  let newarticle = [];
  for (let item in req.query) {
    if (item.search('picture') >= 0) {
      newpicture.push(req.query[item])
    }
  }
  for (let item in req.query) {
    if (item.search('article') >= 0) {
      newarticle.push(req.query[item])
    }
  }
  req.query = {
    title: req.query.title,
    press_time: req.query.press_time,
    picture: newpicture,
    article: newarticle,
    comment: req.query.comment
  }
  http.get('127.0.0.1:3333/consult/add', req.query).then(function (data) {
    res.send(data);
  })
});
// 删除
router.get('/removeLike', function (req, res) {
  let pp = req.query;
  if (req.query.ids.length == 1) {
    pp = { _id: req.query.ids[0] }
  }
  http.get('127.0.0.1:3333/consult/del', pp).then(function (data) {
    res.send(data);
  })
});
// 修改
router.get('/amendLike', function (req, res) {
  http.get('127.0.0.1:3333/consult/update', req.query).then(function (data) {
    res.send(data);
  })
});
module.exports = router;