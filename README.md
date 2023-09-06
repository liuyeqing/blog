运行步骤：
项目安装好包
电脑安装mysql（我安装了mysql8.0.33）
启动index.js，这时会报错，解决方案：https://blog.csdn.net/leilei__66/article/details/110674462https://blog.csdn.net/leilei__66/article/details/110674462
安装navicat（我安装了navicat16），导入test.sql
浏览器访问http://localhost:8081/，就可以看到页面了

sql注入：
没有账号时：用户名输入【a' OR '1'='1'-- 】（这里的'a'可以换成其他字母），密码随便写，就可以登录成功。