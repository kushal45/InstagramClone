const WebSocket = require("ws");
const connections = new Map(); // Store WebSocket connections

function webSocketMiddleware(server) {
  const wss = new WebSocket.Server({ server });
  wss.on("connection", (ws) => {
    console.log("WebSocket connection established");

    ws.on("message", (message) => {
      const parsedMessage = JSON.parse(message);
      if (parsedMessage.type === "register") {
        const userId = parsedMessage.userId;
        console.log(`Registering user with ID: ${userId}`,typeof userId);
        connections.set(userId, ws); // Store connection
        console.log(`User registered with ID: ${userId}`);
      }
    });

    ws.on("close", () => {
      console.log("WebSocket connection closed from server");
      for (const [userId, socket] of connections.entries()) {
        if (socket === ws) {
          connections.delete(userId); // Remove connection
          console.log(`WebSocket connection closed for user ID: ${userId}`);
          break;
        }
      }
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  });

  wss.on("error", (error) => {
    console.error("WebSocket server error:", error);
  });

  return wss;
}

module.exports = { webSocketMiddleware, connections };
