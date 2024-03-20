const Client = require('./Client');
const clients = require('./data');
const express = require("express");
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Get all clients
app.get("/customers", (req, res) => {
  return res.json(clients);
});

// Get client by id
app.get("/customers/:id", (req, res) => {
  const id = req.params.id;
  const client = clients.find((client) => client.id === parseInt(id));

  if (!client) {
    res.status(404).send("Client not found");
  }

  return res.json(client);
});

// Post a client
app.post("/customers", (req, res) => {
  try {
    const currentMaxId = clients[clients.length - 1].id;
    const newClientId = currentMaxId + 1;

    let clientDTO = req.body;
    let newClient = new Client(clientDTO.first_name, clientDTO.last_name, clientDTO.email, clientDTO.gender, clientDTO.image);
    let emptyFields = [];
    let isValidURL = true;

    Object.entries(newClient).forEach(([field, value]) => {
      if (value === '') {
        emptyFields.push(field);
      }
      if (field === 'image') {
        const imageRegex = /^(ftp|http|https):\/\/[^ "]+$/i;
        isValidURL = imageRegex.test(value);
      }
    });

    if (emptyFields.length > 0) {
      return res.status(400).json(`The following fields: ${emptyFields} can't be empty`);
    } 

    if (!isValidURL) {
      return res.status(400).json(`Enter a valid image URL`);
    }

    newClient = { ...newClient, id: newClientId };
    clients.push(newClient);
    return res.status(201).json(newClient);

  } catch (error) {
    console.log(error);
  }
});

// Delete a client
app.delete("/customers/:id", (req, res) => {
  try {
    const id = req.params.id;
    const clientToDelete = clients.find((client) => client.id === parseInt(id));
    const clientToDeletIndex = clients.indexOf(clientToDelete);

    if (clientToDeletIndex === -1) {
      return res.status(404).json(`Client does not exist`);
    }

    clients.splice(clientToDeletIndex, 1);
    res.json({ message: "Client deleted" });
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log("Server listening on: ", port);
});
