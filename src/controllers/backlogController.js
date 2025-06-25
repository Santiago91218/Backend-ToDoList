const Backlog = require("../models/backlog.model");
const Task = require("../models/task.model");

const getBacklog = async (req, res) => {
  try {
    //populate, reemplaza el ObjectId con los datos completos de las tareas correspondientes
    const backlog = await Backlog.find().populate("tareas");
    res.json(backlog);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error al obtener backlog", detalle: err.message });
  }
};

const createBacklog = async (req, res) => {
  try {
    const lastBacklog = await Backlog.findOne().sort({ id: -1 });
    const nextId = lastBacklog ? lastBacklog.id + 1 : 1;

    const newBacklog = new Backlog({ id: nextId });
    await newBacklog.save();

    res.status(201).json(newBacklog);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error al crear el backlog", detalle: err.message });
  }
};

const addTaskToBacklog = async (req, res) => {
  try {
    const idTask = parseInt(req.params.taskId);
    const backlog = await Backlog.findOne({ id: 1 });
    const task = await Task.findOne({ id: idTask });

    if (!task) {
      return res.status(404).json({ error: "La tarea no existe" });
    }

    if (backlog.tareas.includes(task._id)) {
      return res.status(400).json({ error: "La tarea ya esta en la backlog" });
    }

    backlog.tareas.push(task);
    await backlog.save();

    res.status(201).json(backlog);
  } catch (err) {
    res.status(500).json({
      error: "Error al agregar la tarea a la backlog",
      detalle: err.message,
    });
  }
};

module.exports = {
  getBacklog,
  createBacklog,
  addTaskToBacklog,
};
