$(function () {
    init();
})

// 初始化
function init() {
    // 增加弹窗关闭
    $('#consult_add').dialog({
        closed: true,
        title: '新增',
        buttons: [{

            text: '保存',
            handler: addMan1
        }, {
            text: '关闭',
            handler: function () {
                $('#consult_add').dialog('close');
            }

        }]
    })

    // 修改弹窗关闭
    $('#consult_amend').dialog({
        closed: true,
        title: '修改',
        buttons: [{
            text: '保存',
            handler: amendMan2,

        }, {
            text: '关闭',
            handler: function () {
                $('#consult_amend').dialog('close');
            }
        }]
    })

    // 初始化页面表格
    $('#consult_app').datagrid({
        url: '/consult/getLike',
        method: 'get',
        columns: [[
            { field: '', checkbox: true },
            { field: 'title', title: '资讯标题', width: 100 },
            { field: 'press_time', title: '发布时间', width: 100 },
            { field: 'picture', title: '配图', width: 100 },
            { field: 'article', title: '文段', width: 100 },
            { field: 'comment', title: '评论', width: 100 },
        ]],
        pagination: true,
        rownumbers: true,
        toolbar: "#consult_toolbar",
        fit: 'true',
        fitColumns: 'true',
        striped: 'true',
    })

    // 搜索框
    $('#consult_ss').searchbox({
        searcher: function (value, name) {
            let consult_tt = {};
            consult_tt[name] = value;

            $('#consult_app').datagrid('load', consult_tt)
        },
        menu: '#consult_mm',

    });

    // 删除按钮
    $("#consult_clearbtn").linkbutton({
        onClick: clearMan
    });
    // 增加按钮
    $("#consult_addbtn").linkbutton({
        onClick: addMan
    });
    // 移出按钮
    $("#consult_removebtn").linkbutton({
        onClick: removeMan
    });
    // 修改按钮
    $("#consult_amendbtn").linkbutton({
        onClick: amendMan
    })

    //使增加的表单为ajax的方式提交
    $('#consult_form').form({
        url: '/consult/addLike',
        success: addMan2

    })
    // 增加里面的图文编辑
    $('#consult_ap_btn').linkbutton({
        onClick: ap_box
    })
    // 增加里面的评论按钮
    $('#consult_com_btn').linkbutton({
        onClick: com_box
    })
}

// 图文编辑的拼接
// let str1 = '';
let dataindex = 0;
function ap_box() {
    $('#consult_ap_box').append(
        `<input id="iii${dataindex}" type='text'  name="inputFile" multiple='mutiple'  style='width:300px;margin-left:45px;margin-top:30px;'>
        <p>文字：<textarea name="article${dataindex}" id="movies_add_word${dataindex}"  style="margin-left:45px;margin-top:20px;"></textarea></p> 
        `
    )

    $(`#iii${dataindex}`).filebox({
        buttonText: '选择图片',
        buttonAlign: 'right',

        onChange: function () {
            let useid = $(this)[0].id
            $.ajaxFileUpload({
                url: "/consult/upFile",
                fileElementId: $(`#${useid}`).parent().find('input[type=file]').attr('id'),
                dataType: "json",
                success: function (data) {

                    $(`#iii${dataindex}`).attr('name', `picture${dataindex}`);
                    $(`#iii${dataindex}`).val(data);
                    dataindex++;
                }
            });
        }
    })




    // str1 += `
    // <input name="picture" type='file' style='width:300px;margin-left:45px' multiple>
    // <p style="margin-top:10px;margin-left:45px">文段内容</p>
    // <input name='article'  class="easyui-textbox" style="width:300px;height:50px;margin-left:45px">`
    // $('#consult_ap_box').html(str1);
}

// 评论的拼接
let str = '';
function com_box() {
    str += `
<p style='margin-left:45px'>请输入想添加的评论<p/>
<input name='comment' class="easyui-textbox" style="width: 300px;height: 50px;margin-top:10px;margin-left:45px">`

    $('#consult_com_box').html(str);

}


// 绑定按钮，按钮触发函数，，，清空
function clearMan() {
    $('#consult_ss').searchbox('clear');
    $('#consult_app').datagrid('load', {})
}


// --------------------------------增加----------------------------------
// 点击增加按钮，打开窗口
function addMan() {
    $('#consult_add').dialog('open');
}
function addMan1() {
    $('#consult_form').submit();

}
// 确认增加，发送表单的ajax
//增加成功以后的页面渲染和关闭窗口，，还有弹窗
function addMan2() {
    $('#consult_form').form('reset');
    $('#consult_app').datagrid('reload');
    $('#consult_add').dialog('close');
    $.messager.show({
        title: '系统提示',
        msg: '增加资讯成功',
        timeout: 3000,
        showType: 'slide'
    })
}

// --------------------------------删除----------------------------------

function removeMan() {
    $.messager.confirm('确认', '您确认想要删除记录吗？', function (r) {
        if (r) {
            let obj = $('#consult_app').datagrid('getSelections');
            if (obj.length != 0) {
                let ids = [];
                for (let key of obj) {
                    ids.push(key['_id'])
                }
                $.get('/consult/removeLike', { ids }, function (data) {
                    $('#consult_app').datagrid('reload');
                    console.log(data);
                })
            }
            $.messager.show({
                title: '系统提示',
                msg: '删除资讯成功',
                timeout: 3000,
                showType: 'slide'
            })
        }
    })

}
// --------------------------------修改----------------------------------
// 渲染数据
let e_id;
let e_obj;
function amendMan() {
    $('#consult_amend').dialog('open');
    let obj = $('#consult_app').datagrid('getSelections');
    e_obj = obj[0];
    e_id = obj[0]._id;
    $('#consult_amend_title').textbox('setValue', obj[0].title);
    $('#consult_amend_press_time').textbox('setValue', obj[0].press_time);
    $('#consult_amend_picture').textbox('setValue', obj[0].picture);
    $('#consult_amend_article').textbox('setValue', obj[0].article);
    $('#consult_amend_comment').textbox('setValue', obj[0].comment);
}
// 确认修改
function amendMan2() {
    let p = { _id: e_id };
    for (let key in e_obj) {
        if (key != '_id') {
            let elv = $('#consult_amend_' + key).textbox('getValue');
            if (e_obj[key] != elv) {
                p[key] = elv;
            }
        }
    }
    //  发送ajax ,页面加载，关闭窗口
    $.get('consult/amendLike', p, function (data) {
        $('#consult_app').datagrid('reload');
        $('#consult_amend').dialog('close');

    })
}
export default { init };