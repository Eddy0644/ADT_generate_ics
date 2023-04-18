// noinspection SpellCheckingInspection,JSUnresolvedVariable

const express = require('express');
const bodyParser = require('body-parser');
const fs = require("fs");
const moment = require("moment");
const { v4: uuidv4 } = require('uuid');
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

function generate(classInfo, conf) {
    const first_week = "20230306",
        inform_time = conf.inform_time ? conf.inform_time : 20,
        nowDate = new Date(),
        g_name = `2022-2023年度第二学期课程表`,
        g_color = "#ff9500",
        weekdayName = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
    let ahead_trigger = "", ical_body = "";
    //TODO: Rename to classTimeList and CourseList
    let class_timetable = JSON.parse(fs.readFileSync("./classTimeList.json").toString()), class_info = classInfo;
    // try{
    //     class_info=classInfo
    // }catch (e) {
    //     return {s:"ERR",t:"Invalid Course List configuration found when loading. " +
    //             "Please check if your courses are parsed correctly."};
    // }
    if (inform_time === 0) {
        // No ahead alarm
    } else if (inform_time <= 60) {
        ahead_trigger = `-P0DT0H${inform_time}M0S`;
    } else if (inform_time <= 1440) {
        ahead_trigger = `-P0DT${inform_time / 60}H${inform_time % 60}M0S`;
    } else {
        return {s: "ERR", t: "Invalid inform_time! Please check again."};
    }
    ical_body = `BEGIN:VCALENDAR
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
    let initial_time = moment(first_week), i = 1;
    const oneCourse = {
        "weekday": "8",
        "startWeek": "11",
        "endWeek": "12",
        "location": "教中204",
        "name": "形势与政策(四)",
        "teacher": "李玉轩",
        "length": "3",
        "startTime": "6",
        "singleDouble": "0",
        "courseId": "GG610A4",
        "extra": "",
        "endTime": "9",
        "showArray": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
        "colorArray": ["color", "color", "color", "color", "color", "color", "color", "color", "color", "color", "color", "color", "color", "color", "color", "color", "color", "color", "color"],
        "fullName": "形势与政策(四)",
        "colorIndex": "1"
    };
    // for (const oneCourse of class_info)
    {
        let extra_status;
        // Handle with singleDouble classes. ------------
        let deltaDays = 7*(oneCourse.startWeek - 1) + parseInt(oneCourse.weekday)-1 /* -1 for ADT */ - 1;
        if (oneCourse.singleDouble === "1") {
            //single Week
            if (oneCourse.startWeek % 2 === 0) deltaDays += 7;
        } else if (oneCourse.singleDouble === "2") {
            //Double week
            if (oneCourse.startWeek % 2 === 1) deltaDays += 7;
        }
        const firstTimeForCourse = initial_time.add(deltaDays, "days");
        if (oneCourse.singleDouble === "0") {
            extra_status="1";
        }else{
            extra_status=`2;BYDAY=${weekdayName[parseInt(oneCourse.weekday)- 1]}`;
        }
        // 计算课程第一次开始、结束的时间，后面使用RRule重复即可，格式类似 20200225T120000
        // -1 -2 are special constants due to ADT former code.
        let final_stime_str=firstTimeForCourse.format("YYYYMMDD")+"T"+
            class_timetable[(parseInt(oneCourse.startTime)-1).toString()].startTime;
        let final_etime_str=firstTimeForCourse.format("YYYYMMDD")+"T"+
            class_timetable[(parseInt(oneCourse.endTime)-2).toString()].endTime;
        let delta_week_days=7*(parseInt(oneCourse.endWeek)-parseInt(oneCourse.startWeek));
        const finalTimeForCourse=firstTimeForCourse.add(delta_week_days+1,"days");
        const finalTimeForCourseStr=finalTimeForCourse.toISOString();
        let teacher="教师:"+oneCourse.teacher;
        let alarm_base=(ahead_trigger)?`BEGIN:VALARM\nACTION:DISPLAY\nDESCRIPTION:This is an event reminder
TRIGGER:${ahead_trigger}\nX-WR-ALARMUID:${uuidv4()}\nUID:${uuidv4()}\nEND:VALARM\n`:"";
        let utc_now=new Date().toISOString();
        let ical_base=`\nBEGIN:VEVENT
CREATED:${utc_now}\nDTSTAMP:${utc_now}\nSUMMARY:${oneCourse.name}
DESCRIPTION:${teacher}{serial}\nLOCATION:${oneCourse.location}
TZID:Asia/Shanghai\nSEQUENCE:0\nUID:${uuidv4()}\nRRULE:FREQ=WEEKLY;UNTIL=${finalTimeForCourseStr};INTERVAL=${extra_status}
DTSTART;TZID=Asia/Shanghai:${final_stime_str}\nDTEND;TZID=Asia/Shanghai:${final_etime_str}
X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\n${alarm_base}END:VEVENT\n`;
        ical_body+="\n"+ical_base;
        
        
    }
    ical_body+="\nEND:VCALENDAR";
    fs.writeFile("test.ics",ical_body,console.log);
}

// function
fs.readFile("./demo.json", (string) => {
    generate({}, {
    // generate(JSON.parse(string.toString()), {
        xh: "Y02114000",
        inform_time: 20,     // 0 to 1440, in minutes
    });
})