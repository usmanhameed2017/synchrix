require("dotenv").config();
const connectDB = require("./database/connection");
const { port } = require("./constants");
const { server } = require("./app");

connectDB()
.then(() => {
    server.on("error", (error) => console.log(`Express app is failed to listen! ${error}`));
    server.listen(port, () => console.log(`Server is listening at port ${port}`));
})
.catch(error => console.log(`Database connection failed! ${error.message}`));