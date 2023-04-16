// noinspection SpellCheckingInspection,JSUnresolvedVariable

const express = require('express');
const bodyParser = require('body-parser');
const fs = require("fs");
const moment = require("moment");
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
        inform_time=conf.inform_time?conf.inform_time:20,
        nowDate=new Date(),
        g_name=`2022-2023年度第二学期课程表`,
        g_color = "#ff9500",
        weekdays = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
    let ahead_trigger="",ical_body="";
    //TODO: Rename to classTimeList and CourseList
    let class_timetable=JSON.parse(fs.readFileSync("./classTimeList.json").toString()),class_info=classInfo;
    // try{
    //     class_info=classInfo
    // }catch (e) {
    //     return {s:"ERR",t:"Invalid Course List configuration found when loading. " +
    //             "Please check if your courses are parsed correctly."};
    // }
    if(inform_time===0){
        // No ahead alarm
    }else if(inform_time<=60){
        ahead_trigger=`-P0DT0H${inform_time}M0S`;
    }else if(inform_time<=1440){
        ahead_trigger=`-P0DT${inform_time/60}H${inform_time%60}M0S`;
    }else{
        return {s:"ERR",t:"Invalid inform_time! Please check again."};
    }
    ical_body=`BEGIN:VCALENDAR
VERSION:2.0
X-WR-CALNAME:${g_name}
X-APPLE-CALENDAR-COLOR:${g_color}
X-WR-TIMEZONE:Asia/Shanghai
BEGIN:VTIMEZONE
TZID:Asia/Shanghai
X-LIC-LOCATION:Asia/Shanghai
BEGIN:STANDARD
TZOFFSETFROM:+0800
TZOFFSETTO:+0800
TZNAME:CST
DTSTART:19700101T000000
END:STANDARD
END:VTIMEZONE`;
    let initial_time=moment(first_week),i=1;
    for (const oneCourse of class_info) {
        let deltaDays=(oneCourse.startWeek-1)+oneCourse.weekday-1;
        if(oneCourse.singleDouble==="0"){
            //single Week
            if(oneCourse.startWeek%2===0)deltaDays+=7;
        }else{
            //Double week
            if(oneCourse.startWeek%2===1)deltaDays+=7;
        }
        const firstTimeForCourse=initial_time.add("DD",deltaDays);
    }
}
// function
fs.readFile("./demo.json",(string)=>{
    generate(JSON.parse(string),{
        xh:"Y02114000",
        inform_time:20,     // 0 to 1440, in minutes
    });
})