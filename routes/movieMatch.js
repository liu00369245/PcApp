//电影院线匹配管理路由
var express = require('express');
//后台
var http = require('ykt-http-client');
//上传图片
var multiparty = require('multiparty');
var util = require("util");
var router = express.Router();
//-----------------电影------------------------
//页面数据渲染
router.get('/renderData', function (req, res) {
    // console.log(req.query)
    let key;
    let value;
    if (typeof req.query.searchData == 'object') {
        key = req.query.searchData.name;
        value = req.query.searchData.value;
    }
    req.query.page = Number(req.query.page);
    req.query.rows = Number(req.query.rows);
    http.post('127.0.0.1:3333/movieMatch/find', { submitType: "findJoin", ref: ["details", ''] }).then(function (data) {
        // console.log(data)
        let arr = [];
        for (let item of data) {
            // console.log(item.details[0].name_cn)
            item.details[0]._id = item['_id'];//覆盖id方便删除
            //搜索判断
            if (key != undefined && value != undefined) {
                //字符串search方法,key是字符串 所用用['str']方法取到值
                if (item.details[0][key].search(value) > -1) {
                    arr.push(item.details[0])
                }
            } else {
                arr.push(item.details[0])
            }
        }

        //搜索会传额外参数,作为区别正常和搜索渲染

        // for (let item of data) {
        //     item.details[0]._id = item['_id'];
        //     arr.push(item.details[0]);
        // }
        //页面渲染数据格式:[{id},{id}],所以直接send回arr
        res.send(arr);
    })
})
//增加电影-请求数据
router.get('/findRepeatDetails', function (req, res) {
    req.query.page = Number(req.query.page);
    req.query.rows = Number(req.query.rows);
    http.get('127.0.0.1:3333/movieMatch/find', req.query).then(function (data) {
        res.send(data);
    })
})
//增加电影-加载details数据-剔重
router.get('/addData', function (req, res) {
    let repeatId;//重复id
    page = Number(req.query.page);
    rows = Number(req.query.rows);
    http.get('127.0.0.1:3333/details/find', { page, rows }).then(function (data) {
        //判断当前数据库是否有数据,有就剔重
        if (req.query.repeatDetails != undefined) {
            repeatId = req.query.repeatDetails;
            for (let i = 0; i < repeatId.length; i++) {
                for (let k = 0; k < data.rows.length; k++) {
                    if (repeatId[i] == data.rows[k]._id) {
                        data.rows.splice(k, 1);
                        data.total--;
                        k--;
                    }
                }
            }
        }
        // console.log(data)
        res.send(data);
    });
})
//增加按钮
router.post('/addId', function (req, res) {
    //多数据添加必须传数组,如果单数据会被nodejs自动转化为字符串
    let idArr = [];
    let arr = req.body['arr[]'];
    if (typeof arr == 'string') {
        idArr = [{ details: [arr] }]
    } else {
        for (let item of arr) {
            idArr.push({ details: [item] })
        }
    }
    http.post('127.0.0.1:3333/movieMatch/add', { data: idArr, submitType: "addMore" }).then(function (data) {
        res.send(data);
    })
})
//删除电影
router.get('/removeData', function (req, res) {
    let arrIds = req.query.arrIds;
    req.query.page = Number(req.query.page);
    req.query.rows = Number(req.query.rows);
    http.post('127.0.0.1:3333/movieMatch/del', { ids: arrIds }).then(function (data) {
        res.send(data)
    })
})
//-----------------影院------------------------
//影院页面数据渲染
router.post('/renderCinema', function (req, res) {
    let cinemaIdArr = [];
    let seatStr = '';
    page = Number(req.body.page);
    rows = Number(req.body.rows);
    hasId = req.body.id;
    http.post('127.0.0.1:3333/movieMatch/find', { _id: hasId }).then(function (datas) {
        console.log(datas)
        if (datas.cinema != undefined) {
            console.log(1111)
            http.post('127.0.0.1:3333/movieMatch/find', { submitType: "findJoin", ref: ["cinema", ""] }).then(function (data) {
                // 先进行数据解析, 拿到cinema这个关联关键字
                console.log(data);
                for (let item of data) {
                    if (item._id == req.body.id) {
                        cinemaIdArr = item.cinema
                    }
                }
                // 进行判断, 如果没有cinema 就返回undefined, 刷新空页面, 如果有就进行操作
                if (cinemaIdArr != undefined) {
                    http.get('127.0.0.1:3333/seat/find', {}).then(function (data) {
                        for (let i = 0; i < cinemaIdArr.length; i++) {
                            for (let k = 0; k < data.length; k++) {
                                if (cinemaIdArr[i].seat[0] == data[k]._id) {
                                    for (let item of data[k].videoHall) {
                                        seatStr += '-' + item.name + '-'
                                    }
                                }
                            }
                            //增加属性,重置字符串为空
                            cinemaIdArr[i].videoSeats = seatStr
                            seatStr = ''
                        }
                        res.send(cinemaIdArr)
                    })
                } else {
                    // cinemaIdArr 就是[{ 数据 }, { 数据 }], 通过[{ id }, { id }]转化而来
                    res.send(cinemaIdArr)
                }
            })
        } else {
            res.send([])
        }
    })
})
//增加影院-请求数据
router.get('/findRepeatCinema', function (req, res) {
    req.query.page = Number(req.query.page);
    req.query.rows = Number(req.query.rows);
    http.get('127.0.0.1:3333/movieMatch/find', { _id: req.query.movieSelectId }).then(function (data) {
        res.send(data);
    })
})
//增加影院-加载cinema数据-剔重判断
router.get('/addCinema', function (req, res) {
    let repeatCinema;//重复id
    page = Number(req.query.page);
    rows = Number(req.query.rows);
    http.get('127.0.0.1:3333/cinema/find', { page, rows }).then(function (data) {
        //判断当前数据库是否有数据,有就剔重
        if (req.query.repeatCinema != undefined) {
            repeatCinema = req.query.repeatCinema;
            for (let i = 0; i < repeatCinema.length; i++) {
                for (let k = 0; k < data.rows.length; k++) {
                    if (repeatCinema[i] == data.rows[k]._id) {
                        data.rows.splice(k, 1);
                        data.total--;
                        k--;
                    }
                }
            }
        }
        res.send(data)
    });
})
//增加按钮
router.post('/addCId', function (req, res) {
    let id = req.body.matchID
    let cinema = req.body['arr[]']
    if (typeof cinema == 'string') {
        cinema = [cinema, '']
        http.post('127.0.0.1:3333/movieMatch/update', { _id: id, cinema: cinema[0], isPush: true }).then(function (data) {
            res.send(data);
        })
    } else {

        for (let i = 0; i < cinema.length; i++) {
            http.post('127.0.0.1:3333/movieMatch/update', { _id: id, cinema: cinema[i], isPush: true }).then(function (data) {
                if (i == cinema.length - 1) {
                    res.send(data);
                }
            })
        }
    }
})

module.exports = router;