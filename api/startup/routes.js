const routes = require('../routes/index.js');

module.exports = function (app) {
    
    app.use('api/devices', routes.devices)
}