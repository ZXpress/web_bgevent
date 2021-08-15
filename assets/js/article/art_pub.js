$(function () {
    var layer = layui.layer;
    var form = layui.form;

    initCate();
    // 初始化富文本编辑器
    initEditor()
    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！');
                };
                // 调用模板引擎渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res);
                $('#cate_id').html(htmlStr);
                // 一定要记得调用form.render方法重新渲染
                form.render()
            }
        });
    };



    // 1. 初始化图片裁剪器
    var $image = $('#image')
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 为选择封面的按钮绑定点击事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    });


    // 监听coverFile的change事件，获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        // 获取到文件的列表数组
        var files = e.target.files;
        if (files.length === 0) {
            return;
        };
        // 根据选择的文件，创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0]);
        // 为裁剪区重新设置图片
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    });


    // 定义文章的发布状态
    var art_state = '已发布';
    // 为存为草稿按钮绑定点击事件,当点击时将文章的状态改为草稿
    $('#btnSave2').on('click', function () {
        art_state = '草稿';
    });


    // 为表单绑定submit事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        // 基于form表单，快速创建一个formdata对象
        var fd = new FormData($(this)[0]);
        // 将文章发布状态，存到fd中
        fd.append('state', art_state);

        // 将封面裁剪过后的图片，输出为一个文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);
                // 发起ajax请求
                publishArticle(fd);
            });
    });


    // 定义一个发布文章的函数
    function publishArticle(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/add',
            data: fd,
            // 如果向服务器提交的是formdata格式的数据，必须添加一下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！');
                };
                layer.msg('发布文章成功！');
                // 发布文章成功后挑战到文章列表页面
                location.href = '/article/art_list.html';
            }
        });
    };
});