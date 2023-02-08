const devices = require('./devices');
const users = require('./users');
const templates = require('./templates');
const webhooks = require('./webhooks');

const routes = {
    devices,
    users,
    templates,
    webhooks,
    
}

module.exports = routes;