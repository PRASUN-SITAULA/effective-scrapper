const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log("welcome to the server.Running on port " + PORT);
});
