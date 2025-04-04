const WebSocket = require("ws");
const axios = require("axios");
const Student = require('./models/Student');
const Faculty = require('./models/Faculty');

let wssInstance = null;

async function getFullName(email) {
  const student = await Student.findOne({ email });
  if (student) return `${student.firstName} ${student.lastName}`;
  const faculty = await Faculty.findOne({ email });
  if (faculty) return `${faculty.firstName} ${faculty.lastName}`;
  return email.split('@')[0]; // fallback
}

function initializeWebSocket(server) {
  const wss = new WebSocket.Server({ server });
  wssInstance = wss;

  wss.on("connection", (ws) => {
    console.log("🌐 WebSocket connected");

    ws.on("message", async (data) => {
      try {
        const msg = JSON.parse(data);

        if (msg.type === "typing") {
          wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(msg));
            }
          });
        } else {
          const senderName = await getFullName(msg.sender);
          const receiverName = await getFullName(msg.recipient);

          const enrichedMsg = {
            ...msg,
            senderName,
            receiverName,
          };

          // Forward to REST to persist in DB
          await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/chat/send`, enrichedMsg);

          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(enrichedMsg));
            }
          });
        }
      } catch (err) {
        console.error("WebSocket message error:", err);
      }
    });

    ws.on("close", () => {
      console.log("❌ WebSocket disconnected");
    });

    ws.on("error", (err) => {
      console.error("❌ WebSocket connection error:", err);
    });
  });
}

function getWSS() {
  return wssInstance;
}

module.exports = initializeWebSocket;
module.exports.getWSS = getWSS;
