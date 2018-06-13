var express = require('express');
var router = express.Router();
var http = require('ykt-http-client');
//文件上传板块
var multiparty = require('multiparty');
var util = require("util");

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
//请求表格数据
router.get('/getMovie', (req, res) => {
  req.query.page = Number(req.query.page);
  req.query.rows = Number(req.query.rows);
  http.get("127.0.0.1:3333/details/find", req.query).then((data) => {
    res.send(data);
  })
})

//添加
router.get("/detailsAdd", (req, res) => {
  delete req.query.inputFile;
  req.query.actor = req.query.actor.split(",");
  req.query.director = req.query.director.split(",")
  req.query.type = req.query.type.split(",")
  //判断是否上传了图片
  if (req.query.actor_url) {
    req.query.actor_url = req.query.actor_url.split(",")
  }
  if (req.query.index_url) {
    req.query.index_url = req.query.index_url.split(",")
  }
  if (req.query.details_url) {
    req.query.details_url = req.query.details_url.split(",")
  }
  if (req.query.photos_url) {
    req.query.photos_url = req.query.photos_url.split(",")
  }
  if (req.query.director_url) {
    req.query.director_url = req.query.director_url.split(",")
  }
  if (req.query.related_info_url) {
    req.query.related_info_url = req.query.related_info_url.split(",")
  }
  if (req.query.related_movie_url) {
    req.query.related_movie_url = req.query.related_movie_url.split(",")
  }

  http.get("127.0.0.1:3333/details/add", req.query).then((data) => {
    res.send(data);
  })
})


//删除
router.get("/detailsDel", (req, res) => {
  let proam = req.query;
  if (req.query.ids.length == 1) {
    proam = { _id: req.query.ids[0] }
  }
  http.get("127.0.0.1:3333/details/del", proam).then((data) => {
    res.send(data);
  })
})

//修改
router.get("/detailsEdit", (req, res) => {
  delete req.query.inputFile;
  req.query.actor = req.query.actor.split(",");
  req.query.director = req.query.director.split(",")
  req.query.type = req.query.type.split(",")
  //判断是否上传了图片
  if (req.query.actor_url) {
    req.query.actor_url = req.query.actor_url.split(",")
  }
  if (req.query.index_url) {
    req.query.index_url = req.query.index_url.split(",")
  }
  if (req.query.details_url) {
    req.query.details_url = req.query.details_url.split(",")
  }
  if (req.query.photos_url) {
    req.query.photos_url = req.query.photos_url.split(",")
  }
  if (req.query.director_url) {
    req.query.director_url = req.query.director_url.split(",")
  }
  if (req.query.related_info_url) {
    req.query.related_info_url = req.query.related_info_url.split(",")
  }
  if (req.query.related_movie_url) {
    req.query.related_movie_url = req.query.related_movie_url.split(",")
  }

  http.get("127.0.0.1:3333/details/update", req.query).then((data) => {
    res.send("");
  })
})

//上传演员照片
upLoad("actor");
//上传导演照片
upLoad("director");
//上传首页照片
upLoad("index");
//上传电影详情照片
upLoad("details");
//上传相关图集照片
upLoad("photos");
//上传相关资讯照片
upLoad("related_info");
//上传相关电影照片
upLoad("related_movie");


/* 上传演员照片*/
function upLoad(path) {
  router.post(`/${path}`, function (req, res) {
    //生成multiparty对象，并配置上传目标路径
    var form = new multiparty.Form({ uploadDir: `./public/img/${path}/` });  //文件路径可以修改，如果修改记得和下面的路径保持一致

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
      console.log(files);
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
}

module.exports = router;