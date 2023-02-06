module.exports = function (err, req, res, next) {
    
    console.log(err);
    const toSend = {
        status: 'error',
        err: err
    }

    res.status(500).json(toSend);
}