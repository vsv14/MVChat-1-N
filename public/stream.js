const socket =  io('/')


const videoGrid = document.getElementById('video-grid')
const myVideo = document.createElement('video')
myVideo.muted = true


const peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3000',
})

let myVideoStream
navigator.mediaDevices.getUserMedia(
    {
        video: {
            width: { min: 1024, ideal: 1280, max: 1920 },
            height: { min: 776, ideal: 720, max: 1080 }
          },
        audio: true,
    }
).then(stream => {
    myVideoStream = stream
    addVideoStream(myVideo, stream)


    peer.on('call', call => {
        socket.emit('log', 'peer.on call on ' + peer.id)

       if(confirm('Answer to call')){
            call.answer(stream)
            const video = document.createElement('video')

            call.on('stream', userVideoStream => {
                socket.emit('log', 'call.on from user room')
                addVideoStream(video, userVideoStream)
            })
       }
    })
    

    socket.on('user-connected', ({userId, roomId})=>{
        socket.emit('log', `${peer.id} - in room$ ${ROOM_ID}, new user: ${userId}`)
        newUserConected(userId, stream)
    })

}).catch(function(err) {
    console.log('Error video stream', err)
  })


const addVideoStream = (video, stream)=>{
    video.srcObject = stream
    video.addEventListener('loadedmetadata', ()=>{
        video.play()
    })

    videoGrid.append(video)
}

let connected = false

function newUserConected(userId, stream){
    const video = document.createElement('video')
    socket.emit('log','peer.call to '+ userId)
    
    let interval = setInterval(()=>{
        const call = peer.call(userId, stream)
    
        call.on('stream', userVideoStream => {
            clearInterval(interval)
            socket.emit('log','call.on stream for ' + peer.id)
            addVideoStream(video, userVideoStream)
        })
    }, 5000)
    
}


peer.on('open', id =>{
    socket.emit('join-room', ROOM_ID, id)
})

peer.on('connection', function(conn) {
    socket.emit('log','peer on connection')
    conn.on('data', function(data){
      // Will print 'hi!'
      socket.emit('log', {msg:'con on data',...data})
    });
  });