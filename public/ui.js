let msg = $('input')

const chat = $('ul')
const list = document.getElementById('list')


socket.on('new-msg', data =>{
    chat.append(`<li><span>${data.date}</span> <span>${data.id}</span><span><br>${data.msg}</span></li>`)
    $('#list').animate({
        scrollTop: list.scrollHeight - list.clientHeight
     }, 250);
})

$('html').keydown((event)=>{
    if(event.key === 'Enter' && msg.val().lenght !== 0){
        
        let currentDate = new Date(new Date()).toLocaleDateString('en-US', {
            day: undefined,
            month: undefined,
            year: undefined,
            hour: '2-digit',
            minute: '2-digit'
          })

        
        chat.append(`<li><span>${currentDate.split(',')[1]}</span> <span>${socket.id}</span><span><br>${msg.val()}</span></li>`)
        $('#list').animate({
            scrollTop: list.scrollHeight - list.clientHeight
         }, 250);

        socket.emit('message', {id:socket.id, msg:msg.val(), date:currentDate.split(',')[1]})
        msg.val('')
    }
})

// --------------------- UI Buttons
//                     |
//                     V


function setUnMuteBttn(element) {
    
    element.removeClass("fa-microphone-slash").addClass("fa-microphone")
}

function setMuteBttn(element) {
    
    element.removeClass("fa-microphone").addClass("fa-microphone-slash")
}

function muteUnmute(){
    let micr
    if(myVideoStream.getAudioTracks()[0].enabled){
        micr = $('i.fas.fa-microphone')
        myVideoStream.getAudioTracks()[0].enabled = false
        setMuteBttn(micr)
    }else{
        micr = $('i.fas.fa-microphone-slash')
        myVideoStream.getAudioTracks()[0].enabled = true
        setUnMuteBttn(micr)
    }
}