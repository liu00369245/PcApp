function init() {
    //获取电影
    getMovie();
    //增加电影
    addFuc();
    //给添加面板和修改面板添加label
    addLabel();
    //上传和修改照片的函数调用
    up_edit_photo();
    //删除电影
    $("#details_delBtn").linkbutton({
        onClick: details_delFuc,
    })
    //修改电影
    editFuc();
    //查询电影
    searchFuc();
    //清除查询
    $("#details_clearBtn").linkbutton({
        onClick: clearFuc
    })

}



//获取电影函数
function getMovie() {
    $("#details_tb").datagrid({
        url: "/details/getMovie",
        method: "get",
        toolbar: "#details_toolbar",
        columns: [[
            { field: "", checkbox: true, title: "" },
            { field: 'name_cn', title: '电影中文名', width: 100 },
            { field: 'name_eg', title: '电影英文名', width: 100 },
            { field: 'type', title: '类型', width: 100 },
            { field: 'director', title: '导演', width: 100 },
            { field: 'score', title: '电影评分', width: 100 },
            { field: 'actor', title: '演员', width: 100 },
            { field: 'like', title: '想看', width: 100 },
            { field: 'area', title: '区域', width: 100 },
            { field: 'year', title: '年份', width: 100 },
            { field: 'time', title: '电影时长', width: 100 },
            { field: 'release_time', title: '上映时间', width: 100 },
            { field: 'details', title: '详情', width: 100 },
            { field: 'money', title: '票房', width: 100 },
            // { field: 'index_url', title: '图片路径', width: 100 },
            // { field: 'actor_url', title: '演员路径', width: 100 },
            // { field: 'director_url', title: '导演路径', width: 100 },
            // { field: 'details_url', title: '详情图片路径', width: 100 },
            // { field: 'photos_url', title: '图集路径', width: 100 },
            // { field: 'related_info_url', title: '相关信息路径', width: 100 },
            // { field: 'related_movie_url', title: '相关电影路径', width: 100 },
        ]],
        pagination: true,
        rownumbers: true,
        fit: true,
        fitColumns: true,
        striped: true,
    })
}
//增加电影函数
function addFuc() {
    //增加电影按钮事件
    $("#details_addBtn").linkbutton({
        onClick: details_addFuc,
    })
    //增加电影按钮事件函数
    function details_addFuc() {
        $("#details_add").dialog({
            closed: false,
            buttons: [{
                text: "保存",
                handler: details_saveAdd
            }, {
                text: "关闭",
                handler: function () {
                    $("#details_add").dialog("close");
                }
            }]
        });
    }
    //点击保存增加保存按钮
    function details_saveAdd() {
        $("#details_addForm").submit();
    }
    $("#details_addForm").form({
        url: "/details/detailsAdd",
        success: function (data) {
            //清空文本框
            $("#details_addForm").form("reset")
            $("#details_add").dialog("close");
            $("#details_tb").datagrid("reload");

            $.messager.show({
                title: '通知',
                msg: '添加成功',
                timeout: 3000,
                showType: 'slide'
            });
        }
    })
}
//上传和修改函数
function up_edit_photo() {
    //增加上传照片的函数
    upLoad("actor_url", "actor");
    upLoad("director_url", "director")
    upLoad("index_url", "index")
    upLoad("details_url", "details")
    upLoad("photos_url", "photos")
    upLoad("related_info_url", "related_info")
    upLoad("related_movie_url", "related_movie")

    //修改上传照片的函数
    editLoad("actor_url", "actor");
    editLoad("director_url", "director")
    editLoad("index_url", "index")
    editLoad("details_url", "details")
    editLoad("photos_url", "photos")
    editLoad("related_info_url", "related_info")
    editLoad("related_movie_url", "related_movie")
}
//删除函数
function details_delFuc() {
    let obj = $("#details_tb").datagrid("getChecked");
    if (obj.length > 0) {
        $.messager.confirm('确认', '您确认想要删除记录吗？', function (r) {
            if (r) {
                let ids = [];
                for (let item of obj) {
                    ids.push(item._id)
                }
                $.get("/details/detailsDel", { ids }, (data) => {
                    $("#details_tb").datagrid("reload");
                })
            }
        });
    }
}
//查询函数
function searchFuc() {
    $('#details_searchText').searchbox({
        searcher: function (value, name) {
            let obj = {};  //建立空对象
            obj[name] = value;  //将属性值和属性 写入
            $('#details_tb').datagrid({
                queryParams: obj,
            });
        },
    });
}
//清除查询函数
function clearFuc() {
    $("#details_searchText").textbox("setValue", "");
    $('#details_tb').datagrid({
        queryParams: ""
    });
    $("#details_tb").datagrid("reload");
}
//添加上传照片函数
function upLoad(name, path) {
    $('#details_' + name).filebox({
        width: 300,
        buttonText: '选择文件',
        buttonAlign: 'right',
        multiline: true,
        height: 30,
        onChange: function () {
            $.ajaxFileUpload({
                url: `/details/${path}`,
                fileElementId: $("#details_" + name).parent().find('input[type=file]').attr("id"),
                dataType: "json",
                success: function (data) {
                    $("#details_" + name).attr('name', name)
                    $("#details_" + name).val(data);
                }
            });
        }
    })
}
//修改上传照片函数
function editLoad(name, path) {
    $('#details_edit_' + name).filebox({
        width: 300,
        buttonText: '选择文件',
        buttonAlign: 'right',
        multiline: true,
        height: 30,
        onChange: function () {
            $.ajaxFileUpload({
                url: `/details/${path}`,
                fileElementId: $("#details_edit_" + name).parent().find('input[type=file]').attr("id"),
                dataType: "json",
                success: function (data) {
                    $("#details_edit_" + name).attr('name', name)
                    $("#details_edit_" + name).val(data);
                }
            });
        }
    })
}
//添加label
function addLabel() {
    details_AddLabel("details_name_cn", "电影名：", "text")
    details_AddLabel("details_name_eg", "英文电影名：", "text")
    details_AddLabel("details_type", "类型：", "text")
    details_AddLabel("details_director", "导演：", "text")
    details_AddLabel("details_score", "电影评分：", "text")
    details_AddLabel("details_actor", "演员：", "text")
    details_AddLabel("details_like", "想看：", "text")
    details_AddLabel("details_area", "区域：", "text")
    details_AddLabel("details_year", "年份：", "text")
    details_AddLabel("details_time", "电影时长：", "text")
    details_AddLabel("details_release_time", "上映时间：", "text")
    details_AddLabel("details_details", "详情：", "text")
    details_AddLabel("details_money", "票房：", "text")
    details_AddLabel("details_index_url", "首页路径", "file")
    details_AddLabel("details_details_url", "详情路径", "file")
    details_AddLabel("details_photos_url", "图集路径", "file")
    details_AddLabel("details_director_url", "导演路径", "file")
    details_AddLabel("details_actor_url", "演员路径", "file")
    details_AddLabel("details_related_info_url", "相关资讯", "file")
    details_AddLabel("details_related_movie_url", "相关电影", "file")
    //修改面板
    details_AddLabel("details_edit_name_cn", "电影名：", "text")
    details_AddLabel("details_edit_name_eg", "英文电影名：", "text")
    details_AddLabel("details_edit_type", "类型：", "text")
    details_AddLabel("details_edit_director", "导演：", "text")
    details_AddLabel("details_edit_score", "电影评分：", "text")
    details_AddLabel("details_edit_actor", "演员：", "text")
    details_AddLabel("details_edit_like", "想看：", "text")
    details_AddLabel("details_edit_area", "区域：", "text")
    details_AddLabel("details_edit_year", "年份：", "text")
    details_AddLabel("details_edit_time", "电影时长：", "text")
    details_AddLabel("details_edit_release_time", "上映时间：", "text")
    details_AddLabel("details_edit_details", "详情：", "text")
    details_AddLabel("details_edit_money", "票房：", "text")
    details_AddLabel("details_edit_index_url", "首页", "file")
    details_AddLabel("details_edit_details_url", "详情", "file")
    details_AddLabel("details_edit_photos_url", "图集", "file")
    details_AddLabel("details_edit_director_url", "导演", "file")
    details_AddLabel("details_edit_actor_url", "演员", "file")
    details_AddLabel("details_edit_related_info_url", "相关资讯", "file")
    details_AddLabel("details_edit_related_movie_url", "相关电影", "file")

    //添加label的函数
    function details_AddLabel(id, value, type) {
        switch (type) {
            case "text":
                $('#' + id).textbox({
                    label: value,
                    labelPosition: 'left',
                    labelAlign: "right",
                    labelWidth: "80px",
                });
                break;
            case "file":
                $('#' + id).filebox({
                    label: value + "：",
                    labelPosition: 'left',
                    labelAlign: "right",
                    labelWidth: "80px",
                    prompt: value + "路径"
                });
                break;
        }
    }

}
//修改函数
function editFuc() {
    let details_obj;
    $("#details_editBtn").linkbutton({
        onClick: details_editFuc
    })
    //修改函数
    function details_editFuc() {
        let obj = $("#details_tb").datagrid("getChecked")
        if (obj.length == 0) {
            $.messager.alert('警告', '至少选择一条数据！', 'info');
            return;
        }
        else if (obj.length != 1) {
            $.messager.alert('警告', '只能修改一条数据！', 'info');
            return;
        }
        $("#details_edit").dialog({
            closed: false,
            buttons: [{
                text: "确认修改",
                handler: details_saveEdit,     //确认修改
            }, {
                text: "关闭",
                handler: function () {
                    $("#details_edit").dialog("close")  //关闭修改
                }
            }]
        });
        details_obj = obj[0];
        console.log(details_obj);
        $("#details_id").val(obj[0]._id);
        $("#details_edit_name_cn").textbox("setValue", obj[0].name_cn);
        $("#details_edit_name_eg").textbox("setValue", obj[0].name_eg);
        $("#details_edit_type").textbox("setValue", obj[0].type);
        $("#details_edit_director").textbox("setValue", obj[0].director);
        $("#details_edit_score").textbox("setValue", obj[0].score);
        $("#details_edit_actor").textbox("setValue", obj[0].actor);
        $("#details_edit_like").textbox("setValue", obj[0].like);
        $("#details_edit_area").textbox("setValue", obj[0].area);
        $("#details_edit_year").textbox("setValue", obj[0].year);
        $("#details_edit_time").textbox("setValue", obj[0].time);
        $("#details_edit_release_time").textbox("setValue", obj[0].release_time);
        $("#details_edit_details").textbox("setValue", obj[0].details);
        $("#details_edit_money").textbox("setValue", obj[0].money);
        $("#details_edit_index_url").filebox("setText", obj[0].index_url);
        $("#details_edit_details_url").filebox("setText", obj[0].details_url);
        $("#details_edit_photos_url").filebox("setText", obj[0].photos_url);
        $("#details_edit_director_url").filebox("setText", obj[0].director_url);
        $("#details_edit_actor_url").filebox("setText", obj[0].actor_url);
        $("#details_edit_related_info_url").filebox("setText", obj[0].related_info_url);
        $("#details_edit_related_movie_url").filebox("setText", obj[0].related_movie_url);
    }
    //保存修改
    function details_saveEdit() {
        $("#details_editForm").submit();
    }

    $("#details_editForm").form({
        url: "/details/detailsEdit",
        success: function (data) {
            $("#details_editForm").form("reset")
            $("#details_edit").dialog("close");
            $("#details_tb").datagrid("reload");
            $.messager.show({
                title: '通知',
                msg: '修改成功',
                timeout: 3000,
                showType: 'slide'
            });
        }
    })
}




//查询里面的剔重
// let parem = { _id: details_obj._id };
// //数据剔重
// for (let key in details_obj) {
//     if (key != "_id") {
//         let details_editValue = $("#details_edit_" + key).val();
//         if (details_editValue != details_obj[key]) {
//             parem[key] = details_editValue;
//         }
//     }
// }
// $.get("/details/detailsEdit", parem, (data) => {
//     $("#details_edit").dialog("close");
//     $("#details_tb").datagrid("reload");
//     $.messager.show({
//         title: '通知',
//         msg: '修改成功',
//         timeout: 3000,
//         showType: 'slide'
//     });
// })



export default { init };