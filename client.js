let socket = new WebSocket("ws://localhost:8000")

let divUserName = document.querySelector(".div-user-name")
let userName = document.querySelector("#userNameText")
let loginBtn = document.querySelector("#login")

let chat = document.querySelector("#chat")
let sendMessageBtn = document.querySelector("#send-message")
let inputMessage = document.querySelector(".input-send-message")
let usersMessage = document.querySelector("#chat-users-message")
let usersOnline = document.querySelector(".users-online-ul")
let currentUser

window.addEventListener("keypress",(event) => {
    if(event.code === 'Enter'){
        if(userName.value !== ''){
            currentUser = userName.value
            const message = JSON.stringify({
                type: "user",
                text: userName.value
            })
            socket.send(message)
    
            divUserName.classList.add("hide")
            chat.classList.add("chat")
            userName.value = ''
        }else if(inputMessage.value !== ''){
            const message = JSON.stringify({
                type: "message",
                text: inputMessage.value,
                user: currentUser
            })
            socket.send(message)
        
            let div = document.createElement('div')
            div.classList.add("message")
            div.innerText = inputMessage.value
            usersMessage.append(div)
            inputMessage.value = ''
        }
    }
})
loginBtn.addEventListener("click", (event) => {
    if(userName.value !== ''){
        currentUser = userName.value
        const message = JSON.stringify({
            type: "user",
            text: userName.value
        })
        socket.send(message)

        divUserName.classList.add("hide")
        chat.classList.add("chat")
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
    div.classList.add("message")
    div.innerText = inputMessage.value
    usersMessage.append(div)
    inputMessage.value = ''
})

socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if(message.type === "user"){
        let li = document.createElement('li')
        li.innerText = message.text
        usersOnline.append(li)
    }
    else if(message.type === "message"){
        let div = document.createElement('div')
        div.classList.add("message")
        div.innerHTML = `${message.text} </br> <span>from ${message.user}</span>`
        usersMessage.append(div)
    }
})