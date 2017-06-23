/* Magic Mirror
    * Module: MMM-MyWeather
    *
    * By Cowboysdude
    * MIT Licensed.
    */
const NodeHelper = require('node_helper');
var request = require("request");

module.exports = NodeHelper.create({

    start: function() {
       
        console.log("Starting module: " + this.name);
    },

    getWeather: function(url) {
        request({
            url: url,
            method: 'GET'
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var result = JSON.parse(body);
                this.sendSocketNotification('WEATHER_RESULT', result);
            }
        });
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_WEATHER') {
            this.getWeather(payload);
        }
    }
});