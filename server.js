import { WebSocketServer } from "ws";

let clients = {};
const server = new WebSocketServer({ port: 8000 });

server.on("connection", (socket) => {
    let clientId = clientsId(clients);
    socket.on('message', (message) => {
        let inputMessage = JSON.parse(message)

        if(inputMessage.type === "message"){
            server.clients.forEach( client => {
                if(client !== socket){
                    client.send(JSON.stringify({
                        type: 'message',
                        user: inputMessage.user,
                        text: inputMessage.text
                    }))
                }
            })
        }
        else if(inputMessage.type === "user"){
            clients[clientId] = inputMessage.text
            console.log(`${clients[clientId]} connection`);
            server.clients.forEach(client => {
                client.send(JSON.stringify({
                    type: "user",
                    text: inputMessage.text
                }))
            })
        }
    })
    
    socket.on("close", () => {
        console.log(`${clients[clientId]} diconected`);
        delete clients[clientId]
    })
});

/**
 * 
 * @param {object} clients
 * @returns {number}
 */ 

function clientsId(clients) {
    let clientId = Math.floor(Math.random() * 1000 + 1);

    clients[clientId] ? clientsId() : clientId
    
}