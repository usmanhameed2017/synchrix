// Indicate server status
const serverStatus = async (request, response) => {
    return response.status(200)
    .json({ status:200, message:"Hello from Usman Hameed! Server is up and running", app:"Synchrix" });
};

module.exports = { serverStatus };