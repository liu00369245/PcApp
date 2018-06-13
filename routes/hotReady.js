//待映管理路由
var express = require('express');
//后台
var http = require('ykt-http-client');
//上传图片
var multiparty = require('multiparty');
var util = require("util");
var router = express.Router();
// 渲染id
let saveIdr;
router.get('/getData', function (req, res, next) {
    saveIdr = []
    http.get('127.0.0.1:3333/hotReady/find', { submitType: 'findJoin', ref: ['details', ''] }).then(function (data) {
        let arr = [];
        for (let item of data) {
            saveIdr.push(item.details[0]._id)
            arr.push(item.details[0]);
            item.details[0]._id = item._id
        }
        res.send(arr)
    })
});
// 查找电影数据库数据
router.get('/findData', function (req, res, next) {
    http.get('127.0.0.1:3333/details/find', req.query).then(function (data) {
        for (let i = 0; i < data.rows.length; i++) {
            for (let j = 0; j < saveIdr.length; j++) {
                if (data.rows[i]._id == saveIdr[j]) {
                    data.rows.splice(i, 1)
                    i--;
                }
                if (i == -1) {
                    break
                }
            }
        }
        res.send(data)
    })
});
// 联合查询增加id
router.post('/addData', function (req, res, next) {
    let idd = req.body.data
    http.post('127.0.0.1:3333/hotReady/add', { details: [idd] }).then(function (data) {
        res.send(data)
    })
});
// 删除查询
router.post('/delData', function (req, res, next) {
    let aa = JSON.parse(req.body.details)
    http.post('127.0.0.1:3333/hotReady/del', { ids: aa }).then(function (data) {
        res.send(data)
    })
});

// 搜搜
router.get('/search', function (req, res, next) {
    http.post('127.0.0.1:3333/details/find', req.query).then(function (data) {
        http.get('127.0.0.1:3333/hotReady/find', {}).then(function (newData) {
            let obj = [];
            for (let item of data.rows) {
                for (let newItem of newData) {
                    if (item._id == newItem.details[0]) {
                        obj.push(item)
                    }
                }
            }
            res.send(obj)
        })

    })
});

module.exports = router;