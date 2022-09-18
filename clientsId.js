

export function clientsId(clients) {
  let clientId = Math.floor(Math.random() * 1000 + 1);

  clients.hasOwnPoperty(clientId) ? clientsId() : clientId
  
}
