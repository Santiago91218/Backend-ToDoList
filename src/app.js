const express = require("express");
const { envs } = require("./config/config");
const backlogRoutes = require("./routes/backlog.route");
const sprintsRoutes = require("./routes/sprints.route");
const tasksRoutes = require("./routes/tasks.route");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());

const mongoUrl = `mongodb://localhost:27017/${envs.bdurl}`;

app.use(express.json());

//Routes
app.use(backlogRoutes);
app.use(sprintsRoutes);
app.use(tasksRoutes);

//Conexion a MongoDB
mongoose
  .connect(mongoUrl)
  .then(() => console.log("Conectado a MongoDB"))
  .catch((error) => console.error("Error al conectar a MongoDB:", error));

app.listen(envs.port, () => {
  console.log(`Servidor corriendo en el puerto ${envs.port}`);
});

//docker-compose up -d
