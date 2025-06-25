const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  titulo: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
  },
  estado: {
    type: String,
    enum: ["Pendiente", "Progreso", "Completado"],
    default: "Pendiente",
  },
  fechaLimite: {
    type: String,
    required: true,
  },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
