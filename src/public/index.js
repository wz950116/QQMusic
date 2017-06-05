/* ===============================================
 *                公 用 资 源 函 数
 * =============================================== */
export function copyArray(source, array) {
    let index = -1
    const length = source.length

    array || (array = new Array(length))
    while (++index < length) {
        array[index] = source[index]
    }
    return array
}

// shuffle a array
export function shuffle(array) {
    const length = array == null ? 0 : array.length
    if (!length) {
        return []
    }
    let index = -1
    const lastIndex = length - 1
    const result = copyArray(array)
    while (++index < length) {
        const rand = index + Math.floor(Math.random() * (lastIndex - index + 1))
        const value = result[rand]
        result[rand] = result[index]
        result[index] = value
    }
    return result
}

// 将分秒时间格式化
export function timeFormat(time) {
    let minute = parseInt(time / 60),
        second = parseInt(time) % 60;
    return `${minute/10 < 1 ? 0 : ''}${minute} : ${second/10 < 1 ? 0 : ''}${second}`;
};

// 将格式化的时间转化成数字
export function timeConvert(time) {
    let tempArr = time.split(':'),
        minute = parseInt(tempArr[0]),
        second = parseInt(tempArr[1]);
    return minute * 60 + second;
}

// 填充字符*
export function padString(str) {
    let num = parseInt(str);
    if(num>10000){
        let intNum = num/10000,
            floatNum = num%10000 === 0 ? 0 : num%10000;
        return intNum + "." + floatNum;
    }else{
        let newNum = Math.ceil(num/1000)/10;
        return newNum;
    }
}

// 获取昨日为今年第几日*
// 2017-06-04
export function getDayOfYear(val) {
    let date = new Date(val),
        year = date.getFullYear(),   // 2017
        month = date.getMonth(),     // 5
        day = date.getDate(),        // 4
        days = [31, (year % 4 == 0 && year % 100 != 0) || year % 400 == 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    // reduce 接受两个参数  callback（必填） 累加起始值（选填）
    return month ? (days.slice(0, month).reduce((acculator, num) => acculator + num) + day) : day;
}

// 拼接歌手名称 
export function spliceSinger(singers = []) {
    let arr = [];

    singers.forEach(singer => {
        arr.push(singer.name);
    });
    return arr.join('/');
}

// 转化听众数量为百分比*
export function convertListenCount(count) {
    return parseInt(Number(count) * 100) + '%';
}

// 处理生成新的播放列表， 将其推入播放栈
export let stackSonglist = (function() {
    function getStartPoint(index) {
        if (index < 3) {
            return index;
        }
        let diff = index - 20;
        return diff >= 0 ? diff : 0;
    }

    return (songlist, index) => {
        let stackLength = 30, // Songlist length
            startPoint = getStartPoint(index);
        return songlist.slice(startPoint, startPoint + stackLength);
    }
})();

// 根据歌曲ID， 获取歌曲在当前列表的Index
export function getCurrentIndex(list = [], songid) {
    return list.indexOf(list.find(song => {
        let data = typeof song.data == 'object' ? song.data : song;
        return data.songid == songid;
    }));
}

export function preventDefault(e) {
    e && e.preventDefault();
}

// 将歌词信息信息分解成 出现时间、歌词数组、持续时间、三个数组
export function lyricsAnalysis(lyrics) {
    let lyricsObj = {
        timeArr: [],
        lyricsArr: [],
        durationArr: []
    };
    let tempArr = lyrics.split('\n');

    tempArr.forEach(item => {
        let splitPoint = item.indexOf(']');
        lyricsObj.timeArr.push(timeConvert(item.slice(1, splitPoint)));
        lyricsObj.lyricsArr.push(item.slice(splitPoint + 1));
    });
    // count each lyric duration if it's last the default time is 10
    lyricsObj.timeArr.forEach((time, index) => {
        let timeArr = lyricsObj.timeArr;
        lyricsObj.durationArr.push(index == timeArr.length - 1 ? 10 : timeArr[index + 1] - time);
    });
    return filterLyrics(lyricsObj);
}

// 过滤掉歌词数组中 空白等待、换行的部分
export function filterLyrics(lyricsObj) {
    let timeArr = lyricsObj.timeArr || [],
        lyricsArr = lyricsObj.lyricsArr || [],
        durationArr = lyricsObj.durationArr || [];
    let filterArr = [];

    lyricsArr = lyricsArr.filter((item, index) => {
        if (item.trim()) {
            filterArr.push(index);
            return true;
        }
    });
    timeArr = timeArr.filter((item, timeIndex) => filterArr.find(val => timeIndex == val));
    durationArr = durationArr.filter((item, durationIndex) => filterArr.find(val => durationIndex == val));

    return {
        lyricsArr,
        timeArr,
        durationArr
    };
}

// 处理热词 返回数组*
export function dealHotkey(obj) {
    let hotkeyObj = obj || {},
        tempArr = [];
    tempArr = [...hotkeyObj.hotkey];
    tempArr.unshift({
        k: hotkeyObj.special_key,
        url: hotkeyObj.special_url
    });
    return tempArr;
}

export function floatNumber(num, sliceDecimal) {
    let numArr = String(num).split('.'),
        integer = numArr[0],
        decimal = numArr[1] || '';

    return parseFloat(integer + '.' + decimal.slice(0, sliceDecimal >> 0));
}