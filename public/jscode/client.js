let socket = new WebSocket("ws://localhost:8000")

let chat = document.querySelector("#chat")
let sendMessageBtn = document.querySelector("#send")
let inputMessage = document.querySelector(".send-message-input")
let usersMessage = document.querySelector(".users-messages")
let usersOnline = document.querySelector(".users-online-ul")

let currentUser
let users

window.addEventListener("keypress",(event) => {
    if(event.code === 'Enter'){
        if(inputMessage.value !== ''){
            const message = JSON.stringify({
                type: "message",
                text: inputMessage.value,
                user: currentUser
            })
            socket.send(message)
        
            let div = document.createElement('div')
            div.classList.add("message-right")
            div.innerText = inputMessage.value
            usersMessage.append(div)
            inputMessage.value = ''
        }
    }
})

sendMessageBtn.addEventListener("click", (event) => {
    const message = JSON.stringify({
        type: "message",
        text: inputMessage.value,
        user: currentUser
    })
    socket.send(message)

    let div = document.createElement('div')
    div.classList.add("message-right")
    div.innerText = inputMessage.value
    usersMessage.append(div)
    inputMessage.value = ''
})

socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if(message.type === "user"){
        users = message.text
        let child = usersOnline.firstChild;
        while( child ) {
            usersOnline.removeChild( child );
            child = usersOnline.firstChild;
        }

        for(let client in message.text){
            let li = document.createElement('li')
            li.innerText = message.text[client]
            usersOnline.append(li)
        }
    }
    else if(message.type === "message"){
        let div = document.createElement('div')
        div.classList.add("message-left")
        div.innerHTML = `${message.text} </br> <span class="message-from">from ${message.user}</span>`
        usersMessage.append(div)
    }
    else if(message.type === "disconnect"){
        let div = document.createElement('div')
        div.classList.add("message-left")
        div.innerHTML = `User "${message.text}" has left the chat`
        usersMessage.append(div)
    }
})

socket.addEventListener("close", event => {
    const message = JSON.stringify({
        type: "users",
        text: users
    })
    socket.send(message)
    
})
