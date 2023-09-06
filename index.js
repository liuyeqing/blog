const path = require('path')
var fs = require("fs");
var mysql  = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123456',
  timezone:'Asia/Shanghai',
  port: '3306',
  database: 'test'
});

connection.connect(function(err) {
  if (err) {
    console.error('Error connecting to MySQL database: ' + err.stack);
    return;
  }

  console.log('Connected to MySQL database with connection id ' + connection.threadId);
  // 在这里执行连接成功后的操作
});


var express = require('express');
var multer = require('multer');


var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

//配置diskStorage来控制文件存储的位置以及文件名字等
var storage = multer.diskStorage({
  //确定图片存储的位置
  destination: function (req, file, cb){
    cb(null, './public/uploadImgs')
  },
  //确定图片存储时的名字,注意，如果使用原名，可能会造成再次上传同一张图片的时候的冲突
  filename: function (req, file, cb){
    cb(null, Date.now()+file.originalname)
  }
});
//生成的专门处理上传的一个工具，可以传入storage、limits等配置
var upload = multer({storage: storage});

//接收上传图片请求的接口
app.post('/upload', upload.single('file'), function (req, res, next) {
  //图片已经被放入到服务器里,且req也已经被upload中间件给处理好了（加上了file等信息）
  //线上的也就是服务器中的图片的绝对地址
  var url = '/uploadImgs/' + req.file.filename;
  var modSql = `UPDATE user_list SET head_portrait = "${url}" WHERE account = "${req.body.account}"`;
  connection.query(modSql, function (err, result) {
    if(err){
      console.log('上传头像失败 err',err.message);
      let data = {
        code : '1',
        msg : '上传头像失败'
      };
      res.json(data);
      return;
    }
    res.json({
      code : '2',
      msg : '上传头像成功',
      data : url
    });
  });
});


// 点赞
app.get('/like', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
  let modSql = `UPDATE blog_list SET like_num = (like_num+1) like = "1" WHERE id = "${req.query.id}"`;
  connection.query(modSql, function (err, result) {
    if(err){
      console.log('点赞 err',err.message);
      return;
    }
    let data = {
      code : 2,
      msg : '成功'
    };
    res.end(JSON.stringify(data));
  });
});

// 取消点赞
app.get('/cancel_like', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
  let modSql = `UPDATE blog_list SET like_num = (like_num-1) like = "0" WHERE id = "${req.query.id}"`;
  connection.query(modSql, function (err, result) {
    if(err){
      console.log('取消点赞 err',err.message);
      return;
    }
    let data = {
      code : 2,
      msg : '成功'
    };
    res.end(JSON.stringify(data));
  });
});


// 踩
app.get('/vote_down', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
  let modSql = `update blog_list set vote_down = (case vote_down when 1 then 0 when 0 then 1 else vote_down end) where id=22`;
  connection.query(modSql, function (err, result) {
    if(err){
      console.log('踩 err',err.message);
      return;
    }
    let data = {
      code : 2,
      msg : '成功'
    };
    res.end(JSON.stringify(data));
  });
});

// 取消踩
app.get('/cancel_vote_down', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
  let modSql = `update blog_list set vote_down = (case vote_down when 1 then 0 when 0 then 1 else vote_down end) where id=22`;
  connection.query(modSql, function (err, result) {
    if(err){
      console.log('取消踩 err',err.message);
      return;
    }
    let data = {
      code : 2,
      msg : '成功'
    };
    res.end(JSON.stringify(data));
  });
});





// 获取博客详情
app.get('/get_blog_detail', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});//只需要设置响应头的编码格式就好
  // 查看blog_list数据库里的这个账号对应的数据，把这条数据的title和content返回给前端
  let querySql = `SELECT * FROM blog_list WHERE id="${req.query.id}"`;
  connection.query(querySql, function (err, result) {
    if(err){
      console.log('博客详情 err',err.message);
      return;
    }
    console.log('result', result);
    res.end(JSON.stringify(result));
  });
  // 当获取详情时，就增加一个阅读量
  let modSql = `UPDATE blog_list SET read_num = read_num+1 WHERE id = "${req.query.id}"`;
  connection.query(modSql, function (err, result) {
    if(err){
      console.log('博客详情 err',err.message);
      return;
    }
  });
});


app.get('/get_list', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});//只需要设置响应头的编码格式就好
  // 查看blog_list数据库里的这个账号对应的数据，把这条数据的title和content返回给前端
  if(!req.query.pageIndex){
    req.query.pageIndex = 0;
  }
  req.query.pageIndex = Number(req.query.pageIndex);

  let querySql;
  if(req.query.account){
    querySql = `SELECT * FROM blog_list WHERE account="${req.query.account}"  limit 2 offset ${req.query.pageIndex * 2}`;
  }
  else{
    querySql = `SELECT * FROM blog_list  limit 2 offset ${req.query.pageIndex * 2}`;
  }
  connection.query(querySql, function (err, result) {
    if(err){
      console.log('获取列表 err',err.message);
      return;
    }

    let querySql2;
    if(!req.query.account){
      querySql2 = `SELECT * FROM blog_list`;
    }
    else{
      querySql2 = `SELECT * FROM blog_list WHERE account="${req.query.account}"`;
    }
    console.log('querySql2', querySql2);
    connection.query(querySql2, function (err, total_result) {
      console.log('total_result', total_result.length, total_result);
      if(err){
        console.log('获取列表2 err',err.message);
        return;
      }
      let data = {
        result,
        total_num : total_result.length
      };
      res.end(JSON.stringify(data));
    });
  });
});

app.get('/add_blog', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});//只需要设置响应头的编码格式就好
  let account = req.query.account;
  let title = req.query.title;
  let content = req.query.content;
  let create_time = req.query.create_time;
  // 查看数据库里是否存在这个账号
  var  addSql = 'INSERT INTO blog_list(account, title, content, create_time) VALUES(?,?,?,?)';
  var  addSqlParams = [account, title, content, create_time];
  connection.query(addSql, addSqlParams, function (err, result) {
    if(err){
      console.log('添加博客 err',err.message);
      res.end('添加失败');
      return;
    }
    res.end('添加成功');
  });
  res.end('添加成功');
});

app.get('/delete_blog', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});//只需要设置响应头的编码格式就好
  let id = req.query.id;
  var delSql = `DELETE FROM blog_list where id=${id}`;
  connection.query(delSql, function (err, result) {
    if(err){
      console.log('删除 err',err.message);
      return;
    }
  });
  res.end('删除成功');
});

app.get('/login', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});//只需要设置响应头的编码格式就好
  let account = req.query.account;
  let password = req.query.password;

  // 查看数据库里是否存在这个账号
  let querySql = `SELECT * FROM user_list where account='${account}'`;
  connection.query(querySql, function (err, result) {
    console.log('result', result);
    if(err){
      console.log('查询err',err.message);
      return;
    }
    if(result.length == 0){
      let data = {
        msg : '该账号还未注册，请先注册',
        code : 1
      };
      res.end(JSON.stringify(data));
      // connection.end();
      return;
    }
    else{
      // 判断用户输入的密码是否正确
      let queryPassSql = `SELECT * FROM user_list where account='${account}' AND password='${result[0].password}'`;
      connection.query(querySql, function (err, result) {
        console.log('查询密码是否正确result', result);
        if(!err){
          delete result[0].password;
          result[0].msg = '登录成功';
          result[0].code = '2';
          res.end(JSON.stringify(result[0]));
          // res.end('登录成功');
        }
        else{
          let data = {
            msg : '密码不正确，请重新输入密码',
            code : 1
          };
          res.end(JSON.stringify(data));
        }
      })
    }
  });
});

app.get('/register', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});//只需要设置响应头的编码格式就好
  let account = req.query.account;
  let password = req.query.password;
  let head_portrait = req.query.head_portrait;

  var addSql = 'INSERT INTO user_list(account,password, head_portrait) VALUES(?,?,?)';
  let querySql = `SELECT * FROM user_list where account="${account}"`;
  // 查询数据库里有没有这个账号
  connection.query(querySql, function (err, result) {
    if(err){
      return;
    }
    if(result.length > 0){
      res.end('该账号已经注册');
      // connection.end();
      return;
    }
    else{
      var addSql = 'INSERT INTO user_list(account,password, head_portrait) VALUES(?,?,?)';
      var addSqlParams = [account, password, head_portrait];
      //查找id=1的那条数据
      connection.query(addSql, addSqlParams, function (err, result) {
        if(err){
          return;
        }
        // connection.end();
        res.end('注册成功');
      });
    }
  });
});

app.listen(8081);