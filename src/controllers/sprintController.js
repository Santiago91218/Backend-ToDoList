const Sprint = require("../models/sprint.model");
const Task = require("../models/task.model");
const Backlog = require("../models/backlog.model");

const getAllSprints = async (req, res) => {
  try {
    const sprints = await Sprint.find().populate("tareas");
    res.json(sprints);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error al obtener las sprints", detalle: err.message });
  }
};

const getSprintById = async (req, res) => {
  try {
    const idSprint = parseInt(req.params.id);
    const sprint = await Sprint.findOne({ id: idSprint });

    if (!sprint) return res.status(404).send("Sprint no existente");

    res.json(sprint);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error al obtener la sprint", detalle: err.message });
  }
};

const createSprint = async (req, res) => {
  try {
    const { titulo, fechaInicio, fechaCierre } = req.body;
    const lastSprint = await Sprint.findOne().sort({ id: -1 });
    const nextId = lastSprint ? lastSprint.id + 1 : 1;

    const newSprint = new Sprint({
      id: nextId,
      titulo,
      fechaInicio,
      fechaCierre,
    });

    await newSprint.save();
    res.status(201).json(newSprint);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error al crear la sprint", detalle: err.message });
  }
};

const updateSprint = async (req, res) => {
  try {
    const idSprint = parseInt(req.params.id);
    const updates = req.body;

    const sprintUpdate = await Sprint.findOneAndUpdate(
      { id: idSprint },
      updates,
      { new: true }
    );

    if (!sprintUpdate)
      return res.status(404).json({ error: "Sprint no encontrada" });

    res.status(200).json(sprintUpdate);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error al actualizar una sprint", detalle: err.message });
  }
};

const addTaskToSprint = async (req, res) => {
  try {
    const idSprint = parseInt(req.params.id);
    const idTask = parseInt(req.params.taskId);

    const sprint = await Sprint.findOne({ id: idSprint });
    const task = await Task.findOne({ id: idTask });

    if (!sprint || !task) {
      return res.status(404).json({ error: "La sprint o la tarea no existen" });
    }

    if (sprint.tareas.includes(task._id)) {
      return res.status(400).json({ error: "La tarea ya esta en la sprint" });
    }

    sprint.tareas.push(task);
    await sprint.save();

    await Backlog.updateMany({}, { $pull: { tareas: task._id } });

    res.status(200).json(sprint);
  } catch (err) {
    res.status(500).json({
      error: "Error al agregar una tarea a la sprint",
      detalle: err.message,
    });
  }
};

const moveTaskToBacklog = async (req, res) => {
  try {
    const idSprint = parseInt(req.params.id);
    const idTask = parseInt(req.params.taskId);

    const sprint = await Sprint.findOne({ id: idSprint });
    const task = await Task.findOne({ id: idTask });
    const backlog = await Backlog.findOne({ id: 1 });

    if (!sprint || !task || !backlog) {
      return res
        .status(404)
        .json({ error: "Sprint, tarea o backlog no encontrados" });
    }

    await Sprint.updateOne({ id: idSprint }, { $pull: { tareas: task._id } });

    if (!backlog.tareas.includes(task._id)) {
      backlog.tareas.push(task._id);
      await backlog.save();
    }

    res.status(200).json({ mensaje: "Tarea movida al backlog correctamente" });
  } catch (err) {
    res.status(500).json({
      error: "Error al mover la tarea al backlog",
      detalle: err.message,
    });
  }
};

const deleteSprint = async (req, res) => {
  try {
    const idSprint = parseInt(req.params.id);
    const deletedSprint = await Sprint.findOneAndDelete({ id: idSprint });

    if (!deletedSprint) return res.status(404).send("No se encontro el id");

    res.send("Sprint eliminada correctamente");
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error al eliminar una sprint", detalle: err.message });
  }
};

module.exports = {
  getAllSprints,
  getSprintById,
  createSprint,
  updateSprint,
  addTaskToSprint,
  moveTaskToBacklog,
  deleteSprint,
};
