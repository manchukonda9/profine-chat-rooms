const socket = io()
//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')




//templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
//Options
const {username,room} =Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll =() =>{
    //new Message element
    
    const $newMessage = $messages.lastElementChild

    //Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin
    
    //visible height
    const visibleHeight = $messages.offsetHeight

    //Height of message container
    const containerHeight = $messages.scrollHeight

    //how far have i scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }


    console.log(newMessageMargin)
}
socket.on('message', (message) =>{
    console.log(message)
    const html = Mustache.render(messageTemplate,{
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
    
})

socket.on('locationMessage',(message) =>{
    console.log(message.url)
    const html = Mustache.render(locationMessageTemplate,{
        username:message.username,
        url:message.url,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})
//$messages.insertAdjacentElement('beforeend',html)
socket.on('roomData', ({room,users}) =>{
   const html = Mustache.render(sidebarTemplate,{
       room,users
   })
   document.querySelector('#sidebar').innerHTML = html
})


$messageForm.addEventListener('submit',(e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled','disabled')
    //disable
    const message = e.target.elements.message.value

    socket.emit('sendMessage',message, (error) =>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value=''
        $messageFormInput.focus()
        //enable
        if(error){
            alert('No profinity allowed')
            return console.log(error)
        }
        console.log('The message was delivered!')
    })
})
$sendLocationButton.addEventListener('click',() =>{
        if(!navigator.geolocation){
            return alert('Geolocation is not supportted by your browser')
        }
        $sendLocationButton.setAttribute('disabled','disabled')
        navigator.geolocation.getCurrentPosition((position) =>{
            // console.log(position)
            socket.emit('sendLocation',{
                latitude :position.coords.latitude,
                longitude:position.coords.longitude
            },() =>{
                $sendLocationButton.removeAttribute('disabled')
                console.log('Location Shared!')
            })
        })
})


socket.emit('join',{username,room},(error) =>{
    if(error){
        alert(error)
        location.href='/'
    }
})




// socket.on('countUpdated',(count) =>{
//     console.log('The count is updated',count)
// })


// document.querySelector('#increment').addEventListener('click', ()=>{
//     console.log('clicked')
//     socket.emit('increment')
// })