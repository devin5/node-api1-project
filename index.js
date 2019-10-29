// implement your API here
const express = require("express");

const db = require("./data/db");

const server = express();
server.use(express.json());

// GET ALL USERS

server.get("/api/users", (req, res) => {
  db.find()
    .then(users => res.status(200).json(users))
    .catch(err => {
      res.status(500).json({ error: " the user could not be retrieved" });
    });
});

// GET USER BY ID

server.get("/api/users/:id", (req, res) => {
  const id = req.params.id;
  db.findById(id)
    .then(user => {
      console.log(user);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "user with this id does not exist" });
      }
    })
    .catch(err => {
      res.status(500).json({ error: " the user could not be retrieved" });
    });
});

// POST NEW USER

server.post("/api/users", (req, res) => {
  console.log(req.body);
  const { name, bio } = req.body;
  if (!name || !bio) {
    res.status(400).json({ error: "requires name and bio" });
  }
  db.insert({ name, bio })
    .then(idobj =>
      db.findById(idobj.id).then(user => {
        res.status(201).json(user);
      })
    )
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "error retrving user" });
    })

    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "error adding user" });
    });
  //   res.end();
});

// DELETE

server.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;

  db.remove(id)
    .then(user => {
      if (user) {
        res.status(201).json({ message: `User at id ${id} was removed!` });
      } else {
        res.status(404).json({
          errorMessage: "The user with the specified ID does not exist."
        });
      }
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "The user could not be removed." });
    });
});

// PUT

server.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, bio } = req.body;
  if (!name && !bio) {
    // can use a return to shortcut the funciton instead of an else
    return res.status(400).json({ error: "Requires some changes" });
  }
  db.update(id, { name, bio })
    .then(updated => {
      if (updated) {
        db.findById(id)
          .then(user => res.status(200).json(user))
          .catch(err => {
            console.log(err);
            res.status(500).json({ error: "Error retrieving user" });
          });
      } else {
        res.status(404).json({ error: `User with id ${id} not found` });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Error updating user" });
    });
});

server.listen(8000, () => console.log("server on 8000"));
