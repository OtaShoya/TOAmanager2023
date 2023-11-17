import io, {Socket} from "socket.io-client";

const connectSession = ()=>{
    return io("http://localhost:3000/", {
        path: "/api/socket/socket.io",
        transports: ['polling'], 
        auth:{
            sessionID:  localStorage.getItem("sessionID"),
        }
    })
}

const socketInitializer = async (socket:Socket) => {
    await fetch('/api/socket');
 
    socket.on('connect', () => {
        console.log('connected')
    })
 
    socket.on('session_logout', () => {
        localStorage.removeItem("sessionID");
    })

    socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
        console.log(err)
    });

    socket.on("session_created", msg=>{
        localStorage.setItem("sessionID", msg.sessionID);
        localStorage.setItem("userID", msg.userID);
        localStorage.setItem("username", msg.username);
    });
    
}

module.exports = {
    connectSession: connectSession,
    socketInitializer: socketInitializer,
}