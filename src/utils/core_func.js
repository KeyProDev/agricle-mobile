function getAge(dateString)
{
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate()))
    {
        age--;
    }
    return age;
}
function diffTwoDate(date1, date2){
    var date1= new Date(date1);
    var date2= new Date(date2);
    var diff= (date2.getTime()-date1.getTime())/(1000 * 3600 * 24);
    return diff;
}
function timeDeltaToDate(delta) {
    let str = '';
    const day = Math.floor(delta / 24 / 60 / 60 / 1000);
    const hour = Math.floor((delta % (24 * 60 * 60 * 1000)) / 60 / 60 / 1000);
    const minute = Math.floor((delta % (60 * 60 * 1000)) / 60 / 1000);
    const seconds = Math.floor(delta % (60 * 1000)/1000);
    if (day > 0) str += day + 'days ';
    if (hour > 0) str += hour + 'h ';
    if (minute > 0) str += minute + 'min ';
    if (seconds > 0) str += seconds + 's ';
    return str;
  }
function strftime(ss,format) {
    const getFormat = (text) => {
        if (text < 10) return '0' + text
        else return text;
    }
    const d = new Date(ss);
    if(format=='YYYY-mm-dd hh:mm:ss'){
        const dateFormat = d.getFullYear() + '-' + getFormat(d.getMonth() + 1) + '-' + getFormat(d.getDate()) + ' ' + getFormat(d.getHours()) + ':' + getFormat(d.getMinutes()) + ':' + getFormat(d.getSeconds());
        return dateFormat;
    }
    else if(format=='hh:mm:ss'){
        const hour = Math.floor(ss / 3600) < 10 ? '0' + Math.floor(ss / 3600) : Math.floor(ss / 3600);
        const minute = Math.floor((ss % 3600) / 60) < 10 ? '0' + Math.floor((ss % 3600) / 60) : Math.floor((ss % 3600) / 60);
        const second = ss % 60 < 10 ? '0' + ss % 60 : ss % 60;
        return '' + hour + ':' + minute + ':' + second;
    }
    else{
        const dateFormat = d.getFullYear() + '-' + getFormat(d.getMonth() + 1) + '-' + getFormat(d.getDate()) + ' ' + getFormat(d.getHours()) + ':' + getFormat(d.getMinutes()) + ':' + getFormat(d.getSeconds());
        return dateFormat;
    }

}
function utcToChina(time) {
    if(!time) return ''
    const date = new Date(time)
    return strftime(date.setHours(date.getHours()+8),"YYYY-mm-dd hh:mm:ss")
}
function formatBytes(x) {
    const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let l = 0, n = parseInt(x, 10) || 0;

    while(n >= 1024 && ++l){
        n = n/1024;
    }
    //include a decimal point and a tenths-place digit if presenting
    //less than ten of KB or greater units
    return(n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
}
//file
const existFile = (path) => {
   return fs.existsSync(path)
}
function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    return result;
}
function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}
function formatDate(date, type='symbol') {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    if (type === 'symbol') return [year, month, day].join('/');
    else if(type === 'text') return `${year}年 ${month}月 ${day}日`;
}
function formatTime(time, type='symbol') {
    var hour = time.split(':')[0],
        minute = time.split(':')[1],
        second = time.split(':')[2];
    if (hour.length < 2)
        hour = '0' + hour;
    if (minute.length < 2)
        minute = '0' + minute;
    if (second.length < 2)
        second = '0' + second;

    if (type === 'symbol') return [hour, minute].join(':');
    else if(type === 'text') return `${hour}時 ${minute}分`;
}
function formatDay(inputDate, mode='long') {
    const DayLongText = ['日曜日','月曜日','火曜日','水曜日','木曜日','金曜日','土曜日'];
    const DayShortText = ['日','月','火','水','木','金','土'];
    var date = new Date(inputDate);
    return mode === 'long' ? DayLongText[date.getDay()] : DayShortText[date.getDay()];
}
module.exports = {
    getAge,
    formatBytes,
    timeDeltaToDate,
    strftime,
    existFile,
    utcToChina,
    diffTwoDate,
    sleep,
    makeid,
    formatDate,
    formatTime,
    formatDay
};
