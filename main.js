const express = require('express');
const bodyParser = require('body-parser');
const fs = require("fs");
const app = express();
// app.use(express.json());
app.use(bodyParser.json());
// app.use(express.urlencoded({ extended: true }));
app.post("/*", (req, res) => {
    console.log(req.body);
    res.end("Hello Login");
});

app.listen(35741, () => {
    console.log("服务器启动成功");
});
function generate(classInfo,conf){
    const first_week="20230306",
        inform_time=20,
        nowDate=new Date(),
        g_name=`2022-2023年度第二学期课程表`,
        g_color = "#ff9500";
    //TODO: Rename to classTimeList and CourseList
    let class_timetable=JSON.parse(fs.readFileSync("./classTimeList.json").toString()),class_info=classInfo;
    // try{
    //     class_info=classInfo
    // }catch (e) {
    //     return {s:"ERR",t:"Invalid Course List configuration found when loading. " +
    //             "Please check if your courses are parsed correctly."};
    // }

}
fs.readFile("demo.txt",(string)=>{
    generate(JSON.parse(string),{
        xh:"Y02114000",
        inform_time:20,// 0 to 1440
    });
})