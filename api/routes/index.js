const devices = require('./devices');
const users = require('./users');
const templates = require('./templates');
const webhooks = require('./webhooks');
const emqx = require('./emqx');
const alarms = require('./alarms');
const notifications = require('./notifications');


const routes = {
    devices,
    users,
    templates,
    webhooks,
    emqx,
    alarms,
    notifications

    
}

module.exports = routes;