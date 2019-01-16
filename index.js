const express = require("express");
const helmet = require("helmet");
const knex = require("knex");

const knexConfig = require("./knexfile.js");

const server = express();

server.use(express.json());
server.use(helmet());

const db = knex(knexConfig.development);

const port = 5000;

// ** COHORTS **
server.get("/api/cohorts", (req, res) => {
  db("cohorts")
    .then(cohorts => {
      if (cohorts) {
        res.status(200).json(cohorts);
      } else {
        res.status(404).json({ error: "Cohorts not found" });
      }
    })
    .catch(err =>
      res
        .status(500)
        .json({ error: "The cohorts information could not be retrieved." })
    );
});

server.get("/api/cohorts/:id", (req, res) => {
  db("cohorts")
    .where({ id: req.params.id })
    .then(cohort => {
      if (cohort) {
        res.status(200).json(cohort);
      } else {
        res.status(404).json({ error: "Cohort not found" });
      }
    })
    .catch(err =>
      res
        .status(500)
        .json({ error: "The cohort information could not be retrieved." })
    );
});

server.get("/api/cohorts/:id/students", (req, res) => {
  const { id } = req.params;
  db("students")
    .where("cohort_id", id)
    .then(cohort => {
      if (cohort) {
        res.status(200).json(cohort);
      } else {
        res.status(404).json({ error: "Students not found" });
      }
    })
    .catch(err =>
      res
        .status(500)
        .json({ error: "The studen information could not be retrieved." })
    );
});

server.post("/api/cohorts", (req, res) => {
  const changes = req.body;

  db.insert(changes)
    .into("cohorts")
    .then(ids => {
      res.status(201).json(ids);
    })
    .catch(err => {
      res.status(500).json({
        error: "There was an error while saving the cohorts to the database."
      });
    });
});

server.delete("/api/cohorts/:id", (req, res) => {
  db("cohorts")
    .where({ id: req.params.id })
    .del()
    .then(count => {
      if (count) {
        res.status(200).json(count);
      } else {
        res.status(404).json({ error: "Cohort not found" });
      }
    })
    .catch(err =>
      res.status(500).json({ error: "The cohort could not be removed." })
    );
});

server.put("/api/cohorts/:id", (req, res) => {
  const changes = req.body;

  db("cohorts")
    .where({ id: req.params.id })
    .update(changes)
    .then(count => {
      res.status(200).json(count);
    })
    .catch(err =>
      res
        .status(500)
        .json({ error: "The cohort information could not be modified." })
    );
});

// ** STUDENTS **
server.get("/api/students", (req, res) => {
  db("students")
    .then(students => {
      if (students) {
        res.status(200).json(students);
      } else {
        res.status(404).json({ error: "Students not found" });
      }
    })
    .catch(err =>
      res
        .status(500)
        .json({ error: "The students information could not be retrieved." })
    );
});

server.get("/api/students/:id", (req, res) => {
  const { id } = req.params;
  db("students")
    .where("students.id", id)
    .select("students.id", "students.name", "cohorts.name as cohort name")
    .join("cohorts", "students.cohort_id", "cohorts.id")
    .then(student => {
      if (student) {
        res.status(200).json(student);
      } else {
        res.status(404).json({ error: "Student not found" });
      }
    })
    .catch(err =>
      res
        .status(500)
        .json({ error: "The student information could not be retrieved." })
    );
});

server.post("/api/students", (req, res) => {
  const changes = req.body;

  db.insert(changes)
    .into("students")
    .then(ids => {
      res.status(201).json(ids);
    })
    .catch(err => {
      res.status(500).json({
        error: "There was an error while saving the students to the database."
      });
    });
});

server.delete("/api/students/:id", (req, res) => {
  db("students")
    .where({ id: req.params.id })
    .del()
    .then(count => {
      if (count) {
        res.status(200).json(count);
      } else {
        res.status(404).json({ error: "Student not found" });
      }
    })
    .catch(err =>
      res.status(500).json({ error: "The student could not be removed." })
    );
});

server.put("/api/students/:id", (req, res) => {
  const changes = req.body;

  db("students")
    .where({ id: req.params.id })
    .update(changes)
    .then(count => {
      res.status(200).json(count);
    })
    .catch(err =>
      res
        .status(500)
        .json({ error: "The student information could not be modified." })
    );
});

server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
