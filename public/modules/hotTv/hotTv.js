function init() {
    // 输入框
    $('#ht_table').datagrid({
        url: '/hotTv/getData',
        method: 'get',
        pagination: true,
        rownumbers: true,
        fit: true,
        fitColumns: true,
        striped: true,
        columns: [[
            { field: "", checkbox: true },
            { field: 'name_cn', title: '电影中文名', width: 100 },
            { field: 'name_eg', title: '电影英文名', width: 100 },
            { field: 'type', title: '类型', width: 100 },
            { field: 'director', title: '导演', width: 100 },
            { field: 'score', title: '评分', width: 100 },
            { field: 'area', title: '区域', width: 100 },
            { field: 'year', title: '年代', width: 100 },
            { field: 'time', title: '时长', width: 100 },
            { field: 'release_time', title: '上映时间', width: 100 },
            { field: 'money', title: '票房', width: 100 },
            { field: 'details', title: '详情', width: 100, align: 'right' }
        ]],
        toolbar: '#ht_toolbar',
    });
    $('#add_t').window({
        width: 600,
        height: 400,
        modal: true
    }).window('close');
    //初始化 弹窗
    $('#add_t').dialog({
        buttons: [{
            text: '保存',
            handler: saveData
        }, {
            text: '关闭',
            handler: closeData,
        }]
    }).dialog('close')

    $('#ht_search').searchbox({
        searcher: function (value, name) {
            let obj = {};
            if (value) {
                obj[name] = value
                //   改变列表ajax
                $('#ht_table').datagrid({
                    url: '/hotTv/search',
                    queryParams: obj,
                }).datagrid('load')
            }
        },
        menu: '#ht_search_div',
        prompt: '请输入查询字段'
    });
    // 新增电影
    $('#ht_add').linkbutton({ onClick: addData })
    // 删除电影
    $('#ht_remove').linkbutton({ onClick: removeData })
    // 刷新电影
    $('#ht_refresh').linkbutton({ onClick: refreshData })
}
// 当删除被点击时候
function removeData() {
    let arr2 = [];
    let delData = $('#ht_table').datagrid('getSelections');
    for (let item of delData) {
        arr2.push(item._id)
    }
    $.messager.confirm('确认', '您确认想要删除记录吗？', function (r) {
        if (r) {
            $.post('/hotTv/delData', { details: JSON.stringify(arr2) }, function (data) {
                $('#ht_table').datagrid('load')
            })
        }
    });
}
// 当添加被点击时候
function addData() {
    $('#add_t').window('open');
    $('#add_t').datagrid({
        title: '新增电影',
        url: '/hotTv/findData',
        method: 'get',
        pagination: true,
        columns: [[
            { field: 'name_cn', title: '电影中文名', width: 100 },
            { field: 'name_eg', title: '电影英文名', width: 100 },
            { field: 'type', title: '类型', width: 100 },
            { field: 'director', title: '导演', width: 100 },
            { field: 'score', title: '评分', width: 100 },
            { field: 'area', title: '区域', width: 100 },
            { field: 'year', title: '年代', width: 100 },
            { field: 'time', title: '时长', width: 100 },
            { field: 'release_time', title: '上映时间', width: 100 },
            { field: 'money', title: '票房', width: 100 },
            { field: 'details', title: '详情', width: 100, align: 'right' }
        ]]
    });
}
// 当添加保存点击时时
function saveData() {
    let addIpt = $('#add_t').datagrid('getSelections');
    // 发送axaj
    for (let item of addIpt) {
        $.post('/hotTv/addData', { data: item._id }, function (data) {
            $('#ht_table').datagrid('load')
            $('#add_t').window('close')
        })
    }
}
// 当点击关闭时
function closeData() {
    $('#add_t').window('close')
}
// 点击刷新
function refreshData() {
    $('#ht_table').datagrid({
        url: '/hotReady/getData',
    })
    $('#ht_search').textbox('setValue', '')
}
export default { init };