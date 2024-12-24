const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const tasksFile = "./tasks.json";

// Fetch tasks
app.get("/api/tasks", (req, res) => {
  fs.readFile(tasksFile, (err, data) => {
    if (err) return res.status(500).send("Error reading tasks.");
    res.send(JSON.parse(data));
  });
});

// Add task
app.post("/api/tasks", (req, res) => {
  const newTask = req.body;
  fs.readFile(tasksFile, (err, data) => {
    if (err) return res.status(500).send("Error reading tasks.");
    const tasks = JSON.parse(data);
    tasks.push(newTask);
    fs.writeFile(tasksFile, JSON.stringify(tasks), (err) => {
      if (err) return res.status(500).send("Error saving task.");
      res.status(201).send(newTask);
    });
  });
});

// Delete task
app.delete("/api/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  fs.readFile(tasksFile, (err, data) => {
    if (err) return res.status(500).send("Error reading tasks.");
    let tasks = JSON.parse(data);
    tasks = tasks.filter((task) => task.id !== taskId);
    fs.writeFile(tasksFile, JSON.stringify(tasks), (err) => {
      if (err) return res.status(500).send("Error deleting task.");
      res.sendStatus(204);
    });
  });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
