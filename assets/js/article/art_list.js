$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;


    // 定义美化时间的过滤器template
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());
        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    };
    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    };


    // 定义一个查询的参数对象，将来请求数据的时候需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值，默认请求第一页的数据
        pagesize: 2, //每页显示几条数据，默认每页显示2条
        cate_id: '', //文章分类的Id
        state: '' //文章的发布状态
    };

    initTable();
    initCate()

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！');
                };
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                // 调用渲染分页的方法
                renderPage(res.total);
            }
        });
    };


    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                };
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res);
                $('#cate_id').html(htmlStr);
                // 通过layui重新渲染表单区域的UI结构
                form.render();
            }
        });
    };


    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取表单中选项的值
        var cate_id = $('#cate_id').val();
        var state = $('#state').val();
        // 将获取到的值赋值到查询对象q中
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的筛选条件，重新渲染表格的数据
        initTable();
    });


    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用laypage.render方法渲染分页结构
        laypage.render({
            elem: 'pageBox', //注意，这里的分页容器pageBox 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //默认选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的的时候触发jump函数
            // 触发jump回调函数的方式有两种
            // 1.点击页码时,此时first为undefined
            // 2.只要调用了laypage.render()就会触发，此时first为true
            jump: function (obj, first) {
                //console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // 把最新的页码值赋值到q这个查询参数对象中
                q.pagenum = obj.curr;
                // 把最新的条目数赋值到q这个查询参数pagesize属性中
                q.pagesize = obj.limit;
                // 根据最新的q获取对应的数据列表并渲染表格
                // 通过first的值判断你通过那种方式触发的jump
                if (!first) {
                    initTable();
                };
            }
        });
    };


    // 通过代理的方法为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        // console.log(111);
        // 获取当前页面上删除按钮的个数
        var len = $('.btn-delete').length;
        // 获取文章id
        var id = $(this).attr('data-id');
        // 询问用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'get',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！');
                    };
                    layer.msg('删除文章成功！');
                    // 当数据删除完成后需要判断当前一页中是否还有剩余的数据，如果没有剩余的数据了，则让页码值-1之后再重新调用initTable()
                    if (len === 1) {
                        // 如果len的值为1，则证明删除完毕之后页面上就没有数据了
                        // 先判断页码值是否为1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            });
            layer.close(index);
        });
    });
});
