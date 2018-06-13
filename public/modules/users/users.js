$(() => {
    init();
})
//初始化函数
function init() {
    $("#user_tb").datagrid({
        url: "/users/getUser",
        method: "get",
        toolbar: "#user_toolbar",
        columns: [[
            { field: "", checkbox: true, title: "" },
            { field: 'acc', title: '账号', width: 100 },
            { field: 'pwd', title: '密码', width: 100 },
            { field: 'email', title: '邮箱', width: 100 },
            { field: 'phone', title: '手机', width: 100 },
        ]],
        pagination: true,
        rownumbers: true,
        striped: true,
        fit: true,
        fitColumns: true,
    })
    //添加label
    user_AddLabel("user_acc", "账号：")
    user_AddLabel("user_pwd", "密码：")
    user_AddLabel("user_email", "邮箱：")
    user_AddLabel("user_phone", "手机：")

    function user_AddLabel(id, value) {
        $('#' + id).textbox({
            label: value,
            labelPosition: 'left',
            labelAlign: "right",
            labelWidth: "80px",
        });
    }
    //修改面板
    user_AddLabel("user_edit_acc", "账号：")
    user_AddLabel("user_edit_pwd", "密码：")
    user_AddLabel("user_edit_email", "邮箱：")
    user_AddLabel("user_edit_phone", "手机：")

    //--------增加--------------------------------------------------------增加----------------------------------------------------
    $("#user_addBtn").linkbutton({
        onClick: user_addFuc,
    })
    //增加函数
    function user_addFuc() {
        $("#user_add").dialog({
            closed: false,
            buttons: [{
                text: "保存",
                handler: user_saveAdd
            }, {
                text: "关闭",
                handler: function () {
                    $("#user_add").dialog("close");
                }
            }]
        });
    }
    function user_saveAdd() {
        $("#user_addForm").submit();
    }
    $("#user_addForm").form({
        url: "/users/usersAdd",
        success: function (data) {
            //清空文本框
            $(".easyui-textbox").textbox("setValue", "");
            $("#user_add").dialog("close");
            $("#user_tb").datagrid("reload");
            $.messager.show({
                title: '通知',
                msg: '添加成功',
                timeout: 3000,
                showType: 'slide'
            });
        }
    })
    //------删除----------------------------------------------------------删除----------------------------------------------------
    $("#user_delBtn").linkbutton({
        onClick: user_delFuc,
    })
    function user_delFuc() {
        let obj = $("#user_tb").datagrid("getChecked");
        if (obj.length > 0) {
            $.messager.confirm('确认', '您确认想要删除记录吗？', function (r) {
                if (r) {
                    let ids = [];
                    for (let item of obj) {
                        ids.push(item._id)
                    }
                    $.get("/users/usersDel", { ids }, (data) => {
                        $("#user_tb").datagrid("reload");
                    })
                }
            });
        }
    }
    //----------------------------------------------------------------修改----------------------------------------------------
    let user_obj;
    $("#user_editBtn").linkbutton({
        onClick: user_editFuc
    })
    function user_editFuc() {
        let obj = $("#user_tb").datagrid("getChecked")
        if (obj.length == 0) {
            $.messager.alert('警告', '至少选择一条数据！', 'info');
            return;
        }
        else if (obj.length != 1) {
            $.messager.alert('警告', '只能修改一条数据！', 'info');
            return;
        }
        $("#user_edit").dialog({
            closed: false,
            buttons: [{
                text: "确认修改",
                handler: user_saveEdit,     //确认修改
            }, {
                text: "关闭",
                handler: function () {
                    $("#user_edit").dialog("close")  //关闭修改
                }
            }]
        });
        user_obj = obj[0];
        $("#user_edit_acc").textbox("setValue", obj[0].acc);
        $("#user_edit_pwd").textbox("setValue", obj[0].pwd);
        $("#user_edit_email").textbox("setValue", obj[0].email);
        $("#user_edit_phone").textbox("setValue", obj[0].phone);

    }
    //保存修改
    function user_saveEdit() {
        let parem = { _id: user_obj._id };
        //数据剔重
        for (let key in user_obj) {
            if (key != "_id") {
                let user_editValue = $("#user_edit_" + key).val();
                if (user_editValue != user_obj[key]) {
                    parem[key] = user_editValue;
                }
            }
        }
        $.get("/users/usersEdit", parem, (data) => {
            $("#user_edit").dialog("close");
            $("#user_tb").datagrid("reload");
            $.messager.show({
                title: '通知',
                msg: '修改成功',
                timeout: 3000,
                showType: 'slide'
            });
        })
    }
    //查询
    $('#user_searchText').searchbox({
        searcher: function (value, name) {
            let obj = {};  //建立空对象
            obj[name] = value;  //将属性值和属性 写入
            $('#user_tb').datagrid({
                queryParams: obj,
            });
        },
    });
    //清除查询
    $("#user_clearBtn").linkbutton({
        onClick: clearFuc
    })
    function clearFuc() {
        $("#user_searchText").textbox("setValue", "");
        $('#user_tb').datagrid({
            queryParams: ""
        });
        $("#user_tb").datagrid("reload");
    }
}

export default { init }