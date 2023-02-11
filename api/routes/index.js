const devices = require('./devices');
const users = require('./users');
const templates = require('./templates');
const webhooks = require('./webhooks');
const emqx = require('./emqx');
const alarms = require('./alarms');
const routes = {
    devices,
    users,
    templates,
    webhooks,
    emqx,
    alarms

    
}

module.exports = routes;