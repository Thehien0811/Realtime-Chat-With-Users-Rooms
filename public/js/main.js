const chatForm = document.getElementById('chat-form')
const socket = io();

socket.on('message', message => {
    messageOutput();
})

chatForm.addEventListener('submit', (e) =>{
    e.preventDefault();
    const msg = e.target.elements.msg.value;
    console.log(msg)
    socket.emit('chatMessage', msg)
})

function messageOutput(){
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `
        <p class="meta">Brad<span>9:12</span></p>
        <p class="text">kajdlkajsdkjaslkjdajdsklajdklasjklasjakldjalk</p>
    `
    document.querySelector('.chat-messages').append(div)
}

