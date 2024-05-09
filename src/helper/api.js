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
    1: 'drinks',
    2: 'jburger',
    3: 'er',
    4: 'stewed_rice',
    5: 'kc',
    6: 'beb',
    7: 'latte',
    8: 'hot_pot',
    9: 'thai',
    10: 'beer',
    11: 'giki',
    12: 'triceratops',
    13: 'raptor',
    14: 'pterodactyl'
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
        eventName : 'SaveCount'
    })
        .then(function (response) {
            // console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
}