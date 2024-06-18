const socket = io();

// get user information
async function userData() {
    let res = await fetch('http://localhost:3000/feedup/fetch',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })
    let user = await res.json()
    return user
}
(async ()=> {
    // Get DOM elements in respective Js variables
    const form = document.getElementById('send-container');
    const messageInput = document.getElementById('messageInp')
    const messageContainer = document.querySelector(".container")
    
    // Audio that will play on receiving messages
    var audio = new Audio('/resources/ting.mp3');
    
    // Function which will append event info to the contaner
    const append = (message, position) => {
        const messageElement = document.createElement('div');
        messageElement.innerText = message;
        messageElement.classList.add('message');
        messageElement.classList.add(position);
        messageContainer.append(messageElement);
        if (position == 'left') {
            audio.play();
        }
    }
    
    
    // Get name of user logged in
    let user = await userData()
    let firstName = user.name.first_name;
    

    socket.emit('new-user-joined', firstName);

    // If a new user joins, receive his/her name from the server
    socket.on('user-joined', name => {
        append(`${name} joined the chat`, 'right')
    })

    // If server sends a message, receive it
    socket.on('receive', data => {
        append(`${data.name}: ${data.message}`, 'left')
    })

    // If a user leaves the chat, append the info to the container
    socket.on('left', name => {
        append(`${name} left the chat`, 'right')
    })

    // If the form gets submitted, send server the message
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = messageInput.value;
        append(`You: ${message}`, 'right');
        socket.emit('send', message);
        messageInput.value = ''
    })
})();