const express = require('express')
const app = express();
const { get } = require('http');
const http = require('http');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
app.use(cors());




const server = http.createServer(app);

const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });

wss.timeout = 1000 *60 *5


const port = process.env.PORT || 3532;
// Function to start the server
function startServer() {

    
    const userSocketMap = new Map();
    const userSocketTracker = {};
    const AllowedSockets ={}
    const superAdmin = process.env.Superrr
  
    function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

    wss.on('connection', (ws) => {
        console.log('Client connected')
        let id = generateId();
        console.log('overwriteid', id)
        // Store the user-specific socket in the map
        userSocketMap.set(id, ws);
        ws.send(JSON.stringify({ message: 'WebSocket Connection Successful' }));
        ws.on('message', (message) => {
            console.log('we are up and running')
            try {
                const parsedMessage = JSON.parse(message);
                console.log('All Messages', parsedMessage)
                console.log(id)
                
                // console.log('this is our socket map', userSocketMap)

                // Send the message only to the specific user's socket
                let userSocket = userSocketMap.get(id);
                if (userSocket && userSocket.readyState  === WebSocket.OPEN) {
                    console.log('sending message')
                    userSocket.send(JSON.stringify({'cool': `woot: ${id}`}));
                }
                if(parsedMessage.type === 'Admin'){
                    if(parsedMessage.data.adminAuth == superAdmin){
                        console.log('we got a new admin')
                        console.log("parsedMessage.data.id is:" , parsedMessage.data.id)
                        if(parsedMessage.data.id != null){
                            console.log('we got a new admin with id')
                            AllowedSockets[parsedMessage.data.id] = {email: parsedMessage.data.emailAddress, clerkID: parsedMessage.data.clerkID}
                        }
                    }
                }

                if (parsedMessage.type === 'id') {
                    console.log('we got a new id')
                    userSocketTracker[parsedMessage.data] = ws;
                    wss.clients.forEach((client) => {
                        if (userSocket && userSocket.readyState  === WebSocket.OPEN) {
                            console.log('sending message')
                            userSocket.send(JSON.stringify({'Data': `we recieved your id: ${parsedMessage.data} `}));
                        }
                    });
                  }

                if (parsedMessage.type === 'jobmessage' || parsedMessage.type === 'ping') {
                    let output = message;
                    console.log('we got a ping')
                    wss.clients.forEach((client) => {
                      if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ message: parsedMessage }));
                        console.log('sent to client', JSON.stringify({ message: parsedMessage }))
                      }
                    });
                  }

            } catch (error) {
                console.error('Error parsing message:', error);
            }
        });

        ws.on('close', () => {
            // Remove the closed socket from the user-specific map
            console.log('Client disconnected');
            userSocketMap.forEach((socket, key) => {
                if (socket === ws) {
                    userSocketMap.delete(key);
                }
            });
        });
    });



    server.listen(port, () => {
        console.log(`Server is listening at http://localhost:${port}`);
    });

}

// Initial server startup
startServer();


// Handle cleanup when the server is stopped
process.on('SIGINT', () => {
    console.log('Server shutting down');
    process.exit();
});
