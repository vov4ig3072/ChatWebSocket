import { WebSocketServer } from "ws";

import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
let parentDir = __dirname.slice(0, __dirname.lastIndexOf("\\") + 1);

let app = express();

app.use("/", express.static(path.join(parentDir, "public")));

app.get("/", (request, response) => {
  response.sendFile(path.join(parentDir, "public", "index.html"));
});

app.listen(8080);

let clients = {};
const server = new WebSocketServer({ port: 8000 });

server.on("connection", (socket) => {
  let clientId = clientsId(clients);

  socket.on("message", (message) => {
    let inputMessage = JSON.parse(message);

    if (inputMessage.type === "message") {
      server.clients.forEach((client) => {
        if (client !== socket) {
          client.send(
            JSON.stringify({
              type: "message",
              user: inputMessage.user,
              text: inputMessage.text,
            })
          );
        }
      });
    } else if (inputMessage.type === "user") {
      clients[clientId] = inputMessage.text;
      console.log(`${clients[clientId]} connection`);
      server.clients.forEach((client) => {
        client.send(
          JSON.stringify({
            type: "user",
            text: clients,
          })
        );
      });
    } else if (inputMessage.type === "users") {
      server.clients.forEach((client) => {
        client.send(
          JSON.stringify({
            type: "user",
            text: clients,
          })
        );
      });
    }
  });

  socket.on("close", () => {
    console.log(`${clients[clientId]} diconnected`);
    console.log(parentDir);

    server.clients.forEach((client) => {
      client.send(
        JSON.stringify({
          type: "disconnect",
          text: clients[clientId],
        })
      );
    });
    delete clients[clientId];

    server.clients.forEach((client) => {
      client.send(
        JSON.stringify({
          type: "user",
          text: clients,
        })
      );
    });
  });
});

/**
 *
 * @param {object} clients
 * @returns {number}
 */

function clientsId(clients) {
  let clientId = Math.floor(Math.random() * 1000 + 1);

  return clients[clientId] !== undefined ? clientsId(clients) : clientId;
}
