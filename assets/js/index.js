$(function () {
    // 调用函数获取用户基本信息
    getUserInfo();


    // 点击退出按钮实现退出
    $('#btn-out').on('click', function () {
        layui.layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 1.清空本地存储的token
            localStorage.removeItem('token');
            // 2.重新跳转到登录页
            location.href = '/login.html';

            // 3.关闭confirm询问框
            layer.close(index);
        });
    });


});
// 获取用户的基本信息
// 发送ajax请求就调用baseAPI.js
function getUserInfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        // 有权限的接口需要headers请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败');
            } else {
                // 调用renderAvatar渲染用户头像
                renderAvatar(res.data);
            };
        },
        // ajax不论请求成功还是失败都会调用这个函数
        // complete: function (res) {
        //     // 在complete回调函数中，使用res.responseJSON拿到服务器响应回来的数据
        //     console.log(res);
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 1.强制清空token
        //         localStorage.removeItem('token');
        //         // 2.强制跳转到登录页面
        //         location.href = '/login.html';
        //     };
        // }
    });
};


// 渲染用户的头像
function renderAvatar(user) {
    // 获取用户的名称
    var name = user.nickname || user.username;
    // 设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 设置用户头像
    if (user.user_pic == null) {
        // 渲染文字头像
        $('.layui-nav-img').hide();
        var first = name.substr('0', 1);
        $('.text-avatar').html(first).show();
    } else {
        $('.text-avatar').hide();
        $('.layui-nav-img').attr('src', user.user_pic).show();
    };
};