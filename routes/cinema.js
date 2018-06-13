//院线管理路由
var express = require('express');
//后台
var http = require('ykt-http-client');
//上传图片
var multiparty = require('multiparty');
var util = require("util");
var router = express.Router();
//------------------------------表格---------------------------
/* 表格数据渲染 */
router.get('/getCinemadata', function (req, res, next) {
    req.query.page = Number(req.query.page);
    req.query.rows = parseInt(req.query.rows);
    http.post('127.0.0.1:3333/cinema/find', req.query).then(function (data) {
        res.send(data);
    })
});
/*增加院线*/
router.get('/saveinfo_submit', function (req, res, next) {

    console.log(req.query)

    http.post('127.0.0.1:3333/cinema/add', req.query).then(function (data) {
        res.send('ok');
    })
});
/*删除院线*/
router.get('/del_submit', function (req, res, next) {

    console.log(req.query)

    http.post('127.0.0.1:3333/cinema/del', req.query).then(function (data) {
        res.send('data');
    })

    http.post('127.0.0.1:3333/seat/del', req.query).then(function (data) {
        res.send('data');
    })


});
//修改院线
router.get('/update_submit', function (req, res, next) {
    http.post('127.0.0.1:3333/cinema/update', req.query).then(function (data) {
        res.send(data);
    })
});
//座位
router.get('/tingid', function (req, res, next) {

    http.post('127.0.0.1:3333/seat/add', req.query).then(function (data) {
        res.send(data);
    })
});

module.exports = router;