const chatForm = document.getElementById('chat-form')
const socket = io();
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
} )

socket.emit('joinroom', {username, room})
socket.on('message', message => {
    messageOutput(message);
})

chatForm.addEventListener('submit', (e) =>{
    e.preventDefault();
    const msg = e.target.elements.msg.value;
    console.log(msg)
    socket.emit('chatMessage', msg)
})

function messageOutput(message){
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `
        <p class="meta">${message.username}<span> ${message.time}</span></p>
        <p class="text">${message.text}</p>
    `
    document.querySelector('.chat-messages').append(div)
}

