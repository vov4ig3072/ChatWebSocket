let socketAuth = new WebSocket("ws://localhost:8000")

let divUserName = document.querySelector(".container-user-name")
let registrationBtn = document.querySelector('#registration')
let userName = document.querySelector("#userNameInput")
let userPass = document.querySelector("#userPasswordInput")
let loginBtn = document.querySelector("#login")

let containerRoom = document.querySelector(".container-room")
let roomChange = document.querySelector("#room-change")
let roomCreateInput = document.querySelector("#room-create-input")
let roomCreateBtn = document.querySelector("#room-create-btn")

registrationBtn.addEventListener("click", () => {
 
})

window.addEventListener("keypress",(event) => {
    if(event.code === 'Enter'){
        if(userName.value !== '' ){
            currentUser = userName.value
            const message = JSON.stringify({
                type: "user",
                text: userName.value,
                room: roomChange.value
            })
            socketAuth.send(message)
            
            containerRoom.classList.add("hide")
            divUserName.classList.add("hide")
            chat.classList.add("chat")
            userName.value = ''
        }
    }
})

loginBtn.addEventListener("click", (event) => {
    if(userName.value !== ''){
        currentUser = userName.value
        const message = JSON.stringify({
            type: "user",
            text: userName.value,
            room: roomChange.value
        })
        socketAuth.send(message)

        containerRoom.classList.add("hide")
        divUserName.classList.add("hide")
        chat.classList.add("chat")
        userName.value = ''
    }
})