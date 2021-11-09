async function LogMiddleWare(req, res, next){
    console.info(`\x1b[33m${req.method}\x1b[0m ${req.url}`);
    next();
}

module.exports = {LogMiddleWare}