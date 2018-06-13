import users from '../modules/users/users.js'               //用户管理-廖
import details from '../modules/details/details.js'         //电影详情-廖
import cinema from '../modules/cinema/cinema.js'            //院线-粟
import consult from '../modules/consult/consult.js'         //电影资讯-张
import hotMovie from '../modules/hotMovie/hotMovie.js'      //热映-李
import hotReady from '../modules/hotReady/hotReady.js'      //待映-李
import hotTv from '../modules/hotTv/hotTv.js'               //热播-李
import movieMatch from '../modules/movieMatch/movieMatch.js'//匹配-刘

$(() => {
    init()
})
//初始化
function init() {
    login();
    $('#index_left_ul').delegate('li', 'click', renderTabs);
}
//session会话--廖
function login() {
    $.get("/isLogin", (data) => {
        if (data != "") {
            $("#inLogin").html("欢迎你，" + data).attr("href", "#");
        }
        else {
            location.href = "./login.html?"
        }
    });
    $("#outLogin").on("click", (data) => {
        $.get("/outLogin", (data) => {
            $("#inLogin").html("请登录")
        })
    })
}
//content刷新数据页面
function renderTabs() {
    //取得模块化引入名,与自定义属性名一样作为switch选择
    let nameJS = $(this).attr('data-href');
    $(this).css('background', '#DDD').siblings().css('background', 'white')
    //判断是否含有当前选项卡
    let hasTabs = $('#index_content_tabs').tabs('exists', $(this).html());
    if (hasTabs) {
        //如果含有就被选中
        $('#index_content_tabs').tabs('select', $(this).html())
    } else {
        $('#index_content_tabs').tabs('add', {
            title: $(this).html(),
            selected: true,
            closable: true,//tab显示关闭键
            // cache: true,//设置缓存，如果为false，在每次选中所选的tab时，都会加载一次页面内容
            //这里是私人 module ,./加上路径,网页自己创建
            href: `./modules/${$(this).attr('data-href')}/` + $(this).attr('data-href') + '.html',
            onLoad: function () {
                switch (nameJS) {
                    case 'users':
                        users.init();
                        break;
                    case 'details':
                        details.init();
                        break;
                    case 'consult':
                        consult.init();
                        break;
                    case 'hotMovie':
                        hotMovie.init();
                        break;
                    case 'hotTv':
                        hotTv.init();
                        break;
                    case 'hotReady':
                        hotReady.init();
                        break;
                    case 'cinema':
                        cinema.init();
                        break;
                    case 'movieMatch':
                        movieMatch.init();
                        break;
                }
            }
        });
    }
}

