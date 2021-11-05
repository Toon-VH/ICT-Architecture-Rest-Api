const crypto = require("crypto");

function CreateHash(password) {
    return crypto.createHash('sha256').update(password.toString()).digest('hex');
}

module.exports = {CreateHash}