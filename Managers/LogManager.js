const logStore = require("../Database/LogStore");

const getAllLogs = async (req, res) => {
    console.log("Getting all logs..")
    const files = await logStore.getAllLogs();
    if (files !== null) {
        console.log("All logs retrieved successfully!")
        res.send(files);
    } else res.status(500).send("Something Went Wrong !!!");
};

module.exports = {getAllLogs};
