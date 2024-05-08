import axios from "axios";

export function enterPageApi() {
    axios.post('/AddGlobalEventCount', {
        eventName: 'MainPageCount',
    })
        .then(function (response) {
            // console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
}

const types = {
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
        eventName : 'ThemePageCount'
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
        eventName : 'RecordCount'
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
        eventName : 'PictureCount'
    })
        .then(function (response) {
            // console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
}

// export function saveApi(type) {
//     axios.post('/AddThemeEventCount', {
//         themeType: types[type],
//         eventName : 'RecordCount'
//     })
//         .then(function (response) {
//             // console.log(response);
//         })
//         .catch(function (error) {
//             console.log(error);
//         });
// }