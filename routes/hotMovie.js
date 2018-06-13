//热映管理路由
var express = require('express');
//后台
var http = require('ykt-http-client');
//上传图片
var multiparty = require('multiparty');
var util = require("util");
var router = express.Router();
// 渲染id
let saveId;
router.get('/getData', function (req, res, next) {
    saveId = [];
    http.get('127.0.0.1:3333/hotMovie/find', { submitType: 'findJoin', ref: ['details', ''] }).then(function (data) {
        let arr = [];
        for (let item of data) {
            saveId.push(item.details[0]._id)
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
            for (let j = 0; j < saveId.length; j++) {
                if (data.rows[i]._id==saveId[j]) {
                    data.rows.splice(i, 1)
                    i--;
                }
                if(i==-1){
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
    http.post('127.0.0.1:3333/hotMovie/add', { details: [idd] }).then(function (data) {
        res.send(data)
    })
});
// 删除查询
router.post('/delData', function (req, res, next) {
    let aa = JSON.parse(req.body.details)
    http.post('127.0.0.1:3333/hotMovie/del', { ids: aa }).then(function (data) {
        res.send(data)
    })
});
// 搜索
router.get('/search', function (req, res, next) {
    //查询总数据
    http.post('127.0.0.1:3333/details/find',req.query ).then(function (data) {
        // 判断自己数据库是否有
        http.get('127.0.0.1:3333/hotMovie/find', { }).then(function (newData) {
            // console.log(newData)
            let obj=[];
            for(let item of data.rows){
                for(let  newItem of newData ){
                    // 如果有就push进obj
                    if(item._id==newItem.details[0]){
                        obj.push(item)
                    }    
                }
            }  
            res.send(obj)  
        })
    })
});

module.exports = router;