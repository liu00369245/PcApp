$(() => {
    init()
    // $.get('/movieMatch/renderCinema', function (data) {
    //     console.log(data)
    // })
})
//初始化
let a = 0;
let movieSelectId;//存储当前电影数据对应的matchID
let thisCinemaTable;//被选中电影的该条操影院表格的id
function init() {
    //--------------------------表格数据与组件-----------------------
    $('#match_div').datagrid({
        url: '/movieMatch/renderData',
        method: 'get',
        columns: [[
            { field: 'checkRows', title: '全选', checkbox: true },
            { field: 'name_cn', title: '电影中文名', width: 100 },
            { field: 'type', title: '类型', width: 100 },
            { field: 'release_time', title: '上映时间', width: 100 },
            { field: 'time', title: '时长', width: 100 },
        ]],
        pagination: true,
        fit: true,
        fitColumns: true,
        striped: true,
        rownumbers: true,
        toolbar: '#toolbarDiv',
        //改变成数据表格展示
        view: detailview,
        detailFormatter: function (rowIndex, rowData) {
            // console.log(rowData);
            // console.log('--------------------------------------')
            return `<table class='cinemaTable' id ='cinema_div${rowIndex}'></table>`;
        },
        //----------------------------影院嵌套表格开始--------------------------------
        onExpandRow: function (index, row) {
            let cinemaTable = $(this).datagrid('getRowDetail', index).find(`#cinema_div${index}`);
            thisCinemaTable = `cinema_div${index}`;
            movieSelectId = row._id; //储存当前电影的_id,方便加入match数据库时候查找使用;
            // console.log(movieSelectId)
            cinemaTable.datagrid({
                url: '/movieMatch/renderCinema',
                method: 'post',
                queryParams: { id: movieSelectId },
                columns: [[
                    { field: 'name', title: '影院', width: 100 },
                    { field: 'adress', title: '地址', width: 100 },
                    { field: 'phone', title: '电话', width: 100 },
                    { field: 'url', title: '网址', width: 100 },
                    { field: 'videoSeats', title: '放映厅', width: 100 },
                ]],
                pagination: true,
                fitColumns: true,
                striped: true,
                singleSelect: true,
                toolbar: [{
                    iconCls: 'icon-add',
                    text: '增加影院',
                    handler: addCinema
                }, '-', {
                    iconCls: 'icon-remove',
                    text: '删除影院',
                    handler: removeCinema
                }, '-'],
                view: detailview,
                //展开时候触发的增加下表格
                detailFormatter: function (rowIndex, rowData) {
                    return `<table class='seatTable' ></table>`;
                }
            })
        }
    });
    //影院表格(第二个表格)触发点击事件
    $('thisCinemaTable').datagrid({
        onSelect: function (index, row) {
            console.log(row)
        }
    })


    //新增电影
    $('#match_addbtn').linkbutton({ onClick: addDetails });
    //删除电影
    $('#match_removebtn').linkbutton({ onClick: removeDetails });
    //搜索框初
    $('#match_search_ipt').searchbox({
        menu: '#match_search_div',
        prompt: '请输入关键字...',
        searcher: searchDetails
    });
    //清除刷新页面
    $('#match_resetbtn').linkbutton({ onClick: resetDetails });
    //增加电影弹窗
    $('#macth_addDetails').dialog({
        title: '新增电影',
        width: 600,
        height: 400,
        modal: true,
        closed: true,
        closable: false,
        buttons: [{
            text: '新增',
            handler: addOK
        }, {
            text: '关闭',
            handler: closeOK
        }]
    })
    //新增电影表格加载
    $('#addTable').datagrid({
        url: '/movieMatch/addData',
        method: 'get',
        columns: [[
            { field: '', title: '', checkbox: true },
            { field: 'name_cn', title: '电影名', width: 100 },
            { field: 'release_time', title: '上映时间', width: 100 },
            { field: 'time', title: '时长', width: 100 }
        ]],
        pagination: true,
        fitColumns: true,
    });
    //新增影院弹窗
    $('#macth_addCinema').dialog({
        title: '新增影院',
        width: 600,
        height: 400,
        modal: true,
        closed: true,
        closable: false,
        buttons: [{
            text: '新增',
            handler: addOkC
        }, {
            text: '关闭',
            handler: closeOkC
        }]
    })
    //新增影院表格加载
    $('#addTable_cinema').datagrid({
        url: '/movieMatch/addCinema',
        method: 'get',
        columns: [[
            { field: '', title: '', checkbox: true, align: 'center' },
            { field: 'name', title: '影院', width: 100, align: 'center' },
        ]],
        pagination: true,
        fit: true,
        fitColumns: true,
        striped: true,
    });
}
//-------------------------------------增加电影--------------------------------
//增加电影
var repeatDetails = [];
function addDetails() {
    //点击时候发送请求,查询是否有重复数据
    //查询数据库是否含有数据,有数据取出id,增加时候剔重
    $.get('/movieMatch/findRepeatDetails', (data) => {
        //如果有数据再进行剔重
        if (data.length > 0) {
            for (let item of data) {
                repeatDetails.push(item.details[0])
            }
            //发送额外参数,进行剔重
            $('#addTable').datagrid({
                queryParams: { repeatDetails }
            })
        }
    })
    $('#macth_addDetails').dialog('open');
}
//新增按钮
function addOK() {
    let arr = [];
    let detailsId = $('#addTable').datagrid('getSelections');
    //没有数据不被选择就无法被增加,所以进行容错处理
    if (detailsId.length > 0) {
        for (let item of detailsId) {
            arr.push(item['_id'])
        }
        //点击增加按钮,把数据保存到movieMatch数据库
        $.post('/movieMatch/addId', { arr }, (data) => {
            $('#match_div').datagrid('reload');
            $('#addTable').datagrid('reload');
            $.messager.show({
                title: '我的消息',
                msg: '增加成功',
                timeout: 2000,
                showType: 'slide'
            });
            $('#macth_addDetails').dialog('close');
        })
    }
}
//关闭按钮
function closeOK() {
    $('#macth_addDetails').dialog('close');
}
//----------------------------增加影院-----------------------------------
var repeatCinema//重复的影院
function addCinema() {
    //点击时候发送请求,查询是否有重复数据
    $.get('/movieMatch/findRepeatCinema', { movieSelectId }, (data) => {
        //如果有数据再进行剔重
        if (data.cinema != undefined) {
            if (data.cinema.length > 0) {
                repeatCinema = data.cinema
                //增加影院弹窗表格剔重
                $('#addTable_cinema').datagrid({
                    queryParams: { repeatCinema }
                });
            }
        } else {
            $('#addTable_cinema').datagrid({
                queryParams: {}
            });
        }
    })
    $('#macth_addCinema').dialog('open');
}
//新增按钮
function addOkC() {
    let arr = []
    let cinemaId = $('#addTable_cinema').datagrid('getSelections');
    //没有数据不被选择就无法被增加,所以进行容错处理

    if (cinemaId.length > 0) {
        for (let item of cinemaId) {
            arr.push(item['_id'])
        }
        // 点击增加按钮,把数据保存到movieMatch数据库
        $.post('/movieMatch/addCId', { arr, matchID: movieSelectId }, (data) => {

        })
    }
    $('#match_div').datagrid('reload');
    $('#addTable_cinema').datagrid('reload');
    $.messager.show({
        title: '我的消息',
        msg: '增加成功',
        timeout: 2000,
        showType: 'slide'
    });
    $('#macth_addCinema').dialog('close');
}
//关闭按钮
function closeOkC() {
    $('#macth_addCinema').dialog('close');
}
//-------------------------------------删除电影--------------------------------
//删除电影
function removeDetails() {
    let arrIds = [];
    let arrSelect = $('#match_div').datagrid('getSelections');
    if (arrSelect.length > 0) {
        $.messager.confirm('确认', '您确认想要删除记录吗？', function (r) {
            if (r) {
                for (let item of arrSelect) {
                    arrIds.push(item['_id']);
                }
                $.get('/movieMatch/removeData', { arrIds }, function (data) {
                    $('#match_div').datagrid('reload');
                    $.messager.show({
                        title: '我的消息',
                        msg: '删除成功',
                        timeout: 2000,
                        showType: 'slide'
                    });
                })
            }
        });
    }
}
//删除影院
function removeCinema() {

}
//-------------------------------------搜索电影--------------------------------
//搜索电影
function searchDetails(value, name) {
    let obj = { name, value }
    if (value != '') {
        $('#match_div').datagrid({
            queryParams: { searchData: obj }
        })
        $('#match_div').datagrid('reload')
    }

}
//清除刷新页面
function resetDetails() {
    $('#match_search_ipt').searchbox('reset');
    $('#match_div').datagrid({
        queryParams: { searchData: {} }
    });
}
//导出模块,在main.js引入
export default { init }