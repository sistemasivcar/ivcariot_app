import routes from '../routes/index.js';
import error from '../middleware/error.js';

module.exports = function (app) {
    
    app.use('/api/device', routes.devices);
    app.use('/api/user', routes.users);
    app.use(error);
}