const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log("welcome to the server.Running on port " + PORT);
});
