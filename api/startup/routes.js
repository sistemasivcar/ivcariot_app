import routes from '../routes/index.js';
import error from '../middleware/error.js';

module.exports = function (app) {
    
    app.use('/api/device', routes.devices);
    app.use('/api/user', routes.users);
    app.use('/api/template', routes.templates);
    app.use('/api/webhook', routes.webhooks);
    app.use('/api/emqx', routes.emqx);
    app.use('/api/alarm', routes.alarms);
    app.use('/api/notification', routes.notifications);
    app.use('/api/data', routes.datas)
    app.use(error);
}