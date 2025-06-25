const mongoose = require("mongoose");

const backlogSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  tareas: [
    {
      type: mongoose.Schema.Types.ObjectId, //significa que cada elemento del arreglo es una referencia a otro documento por su ID.
      ref: "Task", // ref: "Task": indica que los IDs en este arreglo hacen referencia a documentos del modelo "Task"
      default: [],
    },
  ],
});

const Backlog = mongoose.model("Backlog", backlogSchema);

module.exports = Backlog;
