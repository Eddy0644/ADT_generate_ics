const express = require('express');
const app = express();

app.post("/*", (req, res) => {
    console.log(req);
    console.log(req.body);
    res.end("Hello Login");
});

// 开启监听
app.listen(35741, () => {
    console.log("服务器启动成功");
})