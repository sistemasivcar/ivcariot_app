const devices = require('./devices');
const users = require('./users');
const templates = require('./templates');
const webhooks = require('./webhooks');
const emqx = require('./emqx');

const routes = {
    devices,
    users,
    templates,
    webhooks,
    emqx
    
}

module.exports = routes;