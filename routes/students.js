import express from "express";
import { pool } from "../server.js";

const router = express.Router();

router.get("/", (req, res) => {
  pool.query("SELECT * FROM students", (err, results) => {
    if (err) {
      console.error('Error fetching students:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

router.post("/", (req, res) => {
  const { name, email, course } = req.body;
  const sql = "INSERT INTO students (name, email, course) VALUES (?, ?, ?)";
  pool.query(sql, [name, email, course], (err, result) => {
    if (err) {
      console.error("Error inserting student:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Student added", id: result.insertId });
  });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, course } = req.body;
  pool.query(
    "UPDATE students SET name=?, email=?, course=? WHERE id=?",
    [name, email, course, id],
    (err) => {
      if (err) {
        console.error("Error updating student:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Student updated" });
    }
  );
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  pool.query("DELETE FROM students WHERE id=?", [id], (err) => {
    if (err) {
      console.error("Error deleting student:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Student deleted" });
  });
});

export default router;
