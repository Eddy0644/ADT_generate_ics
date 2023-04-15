const express = require('express');
const bodyParser = require('body-parser');
const app = express();
// app.use(express.json());
app.use(bodyParser.json());
// app.use(express.urlencoded({ extended: true }));
app.post("/*", (req, res) => {
    console.log(req.headers['content-type']); // log the content type header
    console.log(req.headers['content-length']); // log the content length header
    console.log(req.body); // log the plain-text request body
    console.log(req);
    console.log(req.body);
    res.end("Hello Login");
});

// 开启监听
app.listen(35741, () => {
    console.log("服务器启动成功");
})