const app = require("./app");
const http = require("http");

require("dotenv").config();

const PORT = process.env.PORT || 1337;
const server = http.createServer(app);

server.listen(PORT, function () {
  console.log(`Server started on http://localhost:${PORT}`);
});

// server.on("error", function (error) {
//   if (error.syscall !== "listen") {
//     throw error;
//   }

//   switch (error.code) {
//     case "EACCES":
//       console.error(`Port ${PORT} requires elevated privileges`);
//       process.exit(1);
//       break;
//     case "EADDRINUSE":
//       console.error(`Port ${PORT} is already in use`);
//       process.exit(1);
//       break;
//     default:
//       throw error;
//   }
// });
