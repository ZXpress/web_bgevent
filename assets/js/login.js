$(function () {
    // 点击注册账号
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    });
    // 点击登录账号
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    });

    // 自定义校验规则
    // 从layui中获取form对象,使用layui的方法需要先从layui导出
    var form = layui.form;
    var layer = layui.layer;
    // 通过form.verify()函数自定义规则
    form.verify({
        'pwd': [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码是否一致的规则
        repwd: function (value) {
            var pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) return '两次密码不一致！'
        }
    });

    // 监听注册表单提交事件
    $('#form_reg').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/api/reguser',
            data: {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('注册成功!');
                $('#link_login').click();
            }
        });
    });

    // 登录功能的实现
    $('#form_login').submit(function (e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/api/login',
            data: {
                username: $('#form_login [name=username]').val(),
                password: $('#form_login [name=password]').val()
            },
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('登陆失败!');
                };
                layer.msg('登陆成功!');
                // 将登陆成功得到的token字符串保存到localStorage中
                localStorage.setItem('token', res.token);
                // 跳转到后台主页
                // window.open('/index.html');
                location.href = '/index.html';
            }
        });
    });
});