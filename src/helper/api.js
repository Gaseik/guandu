import axios from "axios";

export function enterPageApi() {
    axios.post('/AddGlobalEventCount', {
        eventName: 'MainPageCount',
    })
        .then(function (response) {
            alert("後臺數據傳輸成功" + JSON.stringify(response.data))
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            alert("後臺數據傳輸失敗" + JSON.stringify(error))
            console.log(JSON.stringify(error));
        });
}

const types = {
    0: 'none',
    1: 'MK Pizza Bar',
    2: 'J-BURGER',
    3: 'No Worries Café',
    4: '隱樓',
    5: '德魯納韓式',
    6: '甘答門',
    7: '打卡咖啡',
    8: '餉賀',
    9: '泰雁',
    10: '金色三麥',
    11: 'GIKI',
    12: "_",
    13: "_",
    14: "_",
    15: 'triceratops_1',
    16: 'raptor_1',
    17: 'pterodactyl_1',
    18: 'triceratops_2',
    19: 'raptor_2',
    20: 'pterodactyl_2'
}

export function themeDetect(type) {
    axios.post('/AddThemeEventCount', {
        themeType: types[type],
        eventName: 'ThemePageCount'
    })
        .then(function (response) {
            // console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
}

export function recordApi(type) {

    axios.post('/AddThemeEventCount', {
        themeType: types[type],
        eventName: 'RecordCount'
    })
        .then(function (response) {
            // console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });

}

export function photoTakenApi(type) {

    axios.post('/AddThemeEventCount', {
        themeType: types[type],
        eventName: 'PictureCount'
    })
        .then(function (response) {
            // console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });


}

export function saveApi(type) {
    axios.post('/AddThemeEventCount', {
        themeType: types[type],
        eventName: 'SaveCount'
    })
        .then(function (response) {
            // console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
}