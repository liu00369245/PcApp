$(() => {
    init()
})
//初始化
function init() {
    //===============按钮绑定点击事件=================================
    $('#add_btn').bind('click', function () {
        addCinema()
    });
    // 删除绑定点击事件
    $('#del_btn').bind('click', function () {
        removeCimema()
    });
    // 修改绑定点击事件
    $('#updata_btn').bind('click', function () {
        updataCinema()
    });
    $('#searcher').searchbox({
        searcher: seachCinema,
        menu: '#kind',
        prompt: '请输入查询字段'
    });


    //===============数据列表的渲染=================================

    $('#cinema_list').datagrid({
        fit: true,
        url: '/cinema/getCinemadata',
        method: 'get',
        pagination: true,
        striped: true,
        rownumbers: true,
        selectOnCheck: true,
        fitColumns: true,
        toolbar: "#cinema_toolbar",
        columns: [[
            { field: '', checkbox: true, width: 20, },
            { field: 'name', title: '姓名', width: 200, },
            { field: 'adress', title: '地址', width: 400, },
            { field: 'phone', title: '热线', width: 100 },
            { field: 'url', title: '官网', width: 400 },
        ]],

    });

    //===============对话框的渲染=================================

    //给窗口增加功能性按键 让其默认关闭
    $('#addCinemaBOX').dialog({

        closed: true,//默认关闭
    });
    //给窗口增加功能性按键 让其默认关闭
    $('#updataCinemaBOX').dialog({
        draggable: true,
        resizable: true,
        closed: true,//默认关闭
    });
    // 初始化搜索框
    // $('#searcherCinemaBOX').appendTo('.datagrid-toolbar tr')

    //刷新数据表
    $('#searcher_refresh').click(function (event) {
        $('#searcher').searchbox("reset")
        seachCinema();

    });

    // ===============================================
    // 点击新增影厅出现 影厅对话框
    $('#add_ting').click(function (event) {
        $('#addvideohall_ting_box').dialog('open');
    })
    //影厅增加的对话框
    $('#addvideohall_ting_box').dialog({
        title: '放映厅',
        width: 400,
        height: 400,
        closed: true,//默认关闭
        draggable: true,
        resizable: true,
        buttons: [{
            text: '保存放映厅',
            handler: savetinginfo
        }, {
            text: '关闭',
            handler: function () {
                $('#addvideohall_ting_box').dialog('close')
            }
        }]

    });
    // 点击预览  出现座位对话框  可视化表格
    $('#add_show').click(function (event) {
        $('#seat_show').dialog('open');
        showseat();
    });

    $('#seat_show').dialog({
        title: '座位信息',
        width: 800,
        height: 400,
        closed: true,//默认关闭
        draggable: true,
        resizable: true,
        buttons: [{
            text: '保存座位信息',
            handler: saveseatinfo
        }, {
            text: '关闭预览',
            handler: function () {
                $('#seat_show').dialog('close')
            }
        }]
    });

    $('#change_seat').dialog({
        title: '修改座位信息',
        width: 800,
        height: 400,
        closed: true,//默认关闭
        draggable: true,
        resizable: true,
        buttons: [{
            text: '修改座位信息',
            // handler: confirmseatinfo
        }, {
            text: '确认修改',
            handler: function () {
                $('#change_seat').dialog('close')
            }
        }]
    });

    //点击变红  改变状态值
    $('#seat_show_body').delegate('td', 'click', function (event) {
        $(this).toggleClass("choose")
    });
}

//======================增加院线==================================
function addCinema() {
    $('#addCinemaBOX').dialog({
        title: '增加影院',
        closed: false,
        cache: false,
        modal: true,
        buttons: [{
            text: '保存',
            handler: saveinfo
        }, {
            text: '关闭',
            handler: function () {
                $('#addCinemaBOX').dialog('close')
            }
        }]
    })
}
function saveinfo() {

    //发送影院
    $.get('/cinema/tingid', tingObj, function (data) {
        let param = {
            name: $('#add_cinema_name').val(),
            adress: $('#add_cinema_adress').val(),
            phone: $('#add_cinema_phone').val(),
            url: $('#add_cinema_url').val(),
            seat: [data],
        }
        //影厅
        $.get('/cinema/saveinfo_submit', param, function (data) {
            if (data == 'ok') {
                $('#addCinemaBOX').window('close');
                $('#cinema_list').datagrid('reload');

                //清空消息栏
                $('#add_cinema_name').val('');
                $('#add_cinema_adress').val('');
                $('#add_cinema_phone').val('');
                $('#add_cinema_url').val('');
                $('#add_room').html('')
                $.messager.show({
                    title: '我的消息',
                    msg: '信息增加成功。',
                    timeout: 2000,
                    showType: 'slide'
                });
            }
        })
    })
}
//======================修改院线============================

//定义要修改的这个
var updata_Cinema;
var updata_id;

function updataCinema() {
    $('#updataCinemaBOX').dialog({
        title: '修改',
        width: 300,
        height: 300,
        closed: false,
        cache: false,
        modal: true,
        buttons: [{
            text: '修改',
            handler: updatainfo
        }, {
            text: '关闭',
            handler: function () {
                $('#updataCinemaBOX').dialog('close')
            }
        }]
    })

    //找到当前值
    let delEmp = $('#cinema_list').datagrid('getSelections');
    // //当前选中的数据不能修改多条
    if (delEmp.length != 1) {
        $.messager.alert('提示', '只能编辑单行数据！');
        $('#updataCinemaBOX').dialog('close');
        return;
    } else {
        //记录当前被编辑的
        updata_Cinema = delEmp[0];
        updata_id = updata_Cinema._id;
        $('#updata_cinema_name').val(updata_Cinema.name);
        $('#updata_cinema_adress').val(updata_Cinema.adress)
        $('#updata_cinema_phone').val(updata_Cinema.phone)
        $('#updata_cinema_url').val(updata_Cinema.url)
    }
}

// 发送ajax到服务器修改
function updatainfo() {
    // 创建对象 保存 id 和变化的值过去
    let param = {
        _id: updata_id,
    };
    //找到变化的东西发过去
    for (let key in updata_Cinema) {
        if (key != "_id") {
            let updatainfo = $('#updata_cinema_' + key).val();
            if (updata_Cinema[key] != updatainfo)
                param[key] = updatainfo;
        }
    }
    console.log(param)
    $.get('/cinema/update_submit', param, function (data) {
        if (data == 'ok') {
            $('#updataCinemaBOX').window('close');
            $('#cinema_list').datagrid('reload');
            $.messager.show({
                title: '我的消息',
                msg: '信息修改成功。',
                timeout: 2000,
                showType: 'slide'
            });
        }
    });
}
//======================删除院线==========================
function removeCimema() {

    let rememps = $('#cinema_list').datagrid('getSelections');
    let ids = [];
    let seats = [];
    if (rememps != 0) {
        for (let emp of rememps) {
            //选择的那个几个下标加入到数组中
            ids.push(emp._id)
            seats.push(emp.seat)
        }
        //发送ajax到服务器删除
        $.get('/cinema/del_submit', { ids, seat: seats }, function (data) {

            console.log({ ids, seats })
            //删除成功后刷新行
            $.messager.show({
                title: '我的消息',
                msg: '信息删除成功。',
                timeout: 2000,
                showType: 'slide'
            });
            $('#cinema_list').datagrid('reload')
        })
    } else {
        return
    }
}
// //======================查询院线==================================
function seachCinema(value, name) {
    //           文字  类别name/phone/adress
    let type = {};
    type[name] = value;
    $('#cinema_list').datagrid('load', type)

}
//======================新增加院线=============================


// 座位构建信息
function showseat() {
    let site_rows = $('#ting-rows').val()
    let site_columns = $('#ting-columns').val()
    let str = '';
    //构建作为表   记录每个座位的id和状态值
    for (let i = 1; i <= site_rows; i++) {
        str += '<tr>';
        for (let j = 1; j <= site_columns; j++) {
            str += `<td data-id='${i},${j}';
                        style=' width:30px;height:30px; margin:10px 10px;' class='choose'
                    >
                    </td>
                   `
        }
        str += '</tr>'
        $('#seat_show_body').html(str)
        //加入到新增的预览框下
        $('#seat_show').dialog('open');
    }
}
let tdArr;
//保存预览厅的数据
function saveseatinfo() {
    tdArr = [];   //当前作为的位置数据列表
    let tds = $('#seat_show td')
    for (let i = 0; i < tds.length; i++) {
        if (tds[i].className) {
            tdArr.push([tds[i].dataset.id, 'true'])

        } else {
            tdArr.push([tds[i].dataset.id, 'flase'])

        }
    }
    // 保存座位信息
    $('#tingseat').val(tdArr);
    $('#seat_show').dialog('close')
}


//影厅对象
let tingArr = [];
let tingObj = {};
tingObj.videoHall = tingArr;

//放映厅保存
function savetinginfo() {
    $('#seat_show_body').val('')
    $('#addvideohall_ting_box').dialog('close')
    let obj = {}
    obj.name = $('#tingname').val();
    obj.seat = tdArr;
    tingArr.push(obj)


    console.log(tingArr);
    console.log(tingObj)
    $('#add_room').append(

        `<div style="text-align:center;width:200px;height:50px;border:1px solid #e8e8e8; margin:30px auto;border-radius:30px">
                <h1>${$('#tingname').val()}</h1>

         </div>`
    )
    //清空输入框
    $('#tingname').val('')
    $('#tingseat').val('')

}


export default { init };