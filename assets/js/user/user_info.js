$(function () {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在1~6个字符之间';
            };
        }
    });


    initUserInfo();
    // 初始化用户基本信息
    function initUserInfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                };
                // 调用form.var()快速为表单赋值
                form.val('formUserInfo', res.data);
            }
        });
    };


    // 重置表单
    $('#btnReset').on('click', function (e) {
        e.preventDefault();
        // 再次调用initUserInfo()重新填充表单
        initUserInfo();
    });

    // 发起更新用户数据的请求
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！');
                };
                layer.msg('更新用户信息成功！');
                // 调用父页面中的方法，重新渲染用户的头像和用户的信息
                window.parent.getUserInfo();
            }
        });
    });
});