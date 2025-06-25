const Task = require("../models/task.model");
const Sprint = require("../models/sprint.model");
const Backlog = require("../models/backlog.model");

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error al obtener las tareas", detalle: err.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const idTask = parseInt(req.params.id);
    const task = await Task.findOne({ id: idTask });

    if (!task) {
      return res.status(404).send("Tarea no existente");
    }

    res.json(task);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error al obtener la tarea", detalle: err.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { titulo, descripcion, fechaLimite } = req.body;
    const lastTask = await Task.findOne().sort({ id: -1 });
    const nextId = lastTask ? lastTask.id + 1 : 1;

    const newTask = new Task({
      id: nextId,
      titulo,
      descripcion,
      fechaLimite,
    });
    await newTask.save();

    let backlog = await Backlog.findOne({ id: 1 });
    if (!backlog) {
      backlog = new Backlog({ id: 1, tareas: [] });
    }

    backlog.tareas.push(newTask);
    await backlog.save();
    res.status(201).json(newTask);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error al crear la tarea", detalle: err.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const idTask = parseInt(req.params.id);
    const updates = req.body;

    const updatedTask = await Task.findOneAndUpdate({ id: idTask }, updates, {
      new: true,
    });

    if (!updatedTask) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    res.status(200).json(updatedTask);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error al actualizar una tarea", detalle: err.message });
  }
};

const updateStateTask = async (req, res) => {
  try {
    const idTask = parseInt(req.params.id);
    const { estado } = req.body;

    const validStatues = ["Pendiente", "Progreso", "Completado"];

    if (!validStatues.includes(estado)) {
      return res.status(400).json({ error: "Estado no valido" });
    }

    const task = await Task.findOne({ id: idTask });

    if (!task) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    task.estado = estado;
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({
      error: "Error al actualizar el estado de una tarea",
      detalle: err.message,
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const idTask = parseInt(req.params.id);

    const task = await Task.findOne({ id: idTask });
    if (!task) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    //{}: todos los documentos
    //$pull: elimina elementos especificos de un arreglo
    await Backlog.updateMany({}, { $pull: { tareas: task._id } });

    const taskObjectId = task._id;

    await Sprint.updateMany({}, { $pull: { tareas: taskObjectId } });

    await Task.findOneAndDelete({ id: idTask });

    res.send("Tarea eliminada correctamente");
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error al eliminar una tarea", detalle: err.message });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  updateStateTask,
  deleteTask,
};
