require("dotenv").config();
const express = require("express");
const routes = require('./routes')
const config = require("./config");
const middleware = require("./middleware");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require('morgan')
const error = require('./error')
const cors = require("cors");
const app = express();
const authRoutes = require('./routes/authRoutes.js')

//Database Connection
config.dbConnect()

// Middlewares
app.use([morgan('short'), cookieParser(), bodyParser.json(), cors(config.corsOptions), middleware.logger]);
app.use([routes.adminRoutes]);
app.use([error.handler])
app.use('/api/v1/auth', authRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server is running at port: ", PORT);
});
