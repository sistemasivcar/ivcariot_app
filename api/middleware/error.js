module.exports = function (err, req, res, next) {
    
    console.log(err);
    const toSend = {
        status: 'error',
        err: err || 'Something was wrong'
    }

    res.status(500).json(toSend);
}