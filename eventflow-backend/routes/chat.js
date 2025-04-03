const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const Chat = require("../models/Chat");
const Student = require("../models/Student");
const Faculty = require("../models/Faculty");
const { getWSS } = require("../websocket");

async function getFullName(email) {
  const student = await Student.findOne({ email });
  if (student) return `${student.firstName} ${student.lastName}`;
  const faculty = await Faculty.findOne({ email });
  if (faculty) return `${faculty.firstName} ${faculty.lastName}`;
  return email.split('@')[0];
}

// ✅ Get enriched chats with unread count
router.get("/chats/:user", async (req, res) => {
  const { user } = req.params;

  try {
    const chats = await Chat.find({ participants: user });

    const enrichedChats = await Promise.all(
      chats.map(async (chat) => {
        const otherParticipant = chat.participants.find(p => p !== user);

        let participantNames = chat.participantNames;
        if (!participantNames || participantNames.length !== chat.participants.length) {
          participantNames = await Promise.all(
            chat.participants.map(email => getFullName(email))
          );
        }

        // Fix participant name alignment
const participantNameMap = {};
chat.participants.forEach((p, i) => {
  participantNameMap[p] = participantNames[i];
});

return {
  chatId: chat.chatId,
  email: otherParticipant,
  lastMsg: chat.lastMessage || "",
  time: chat.updatedAt ? new Date(chat.updatedAt).toLocaleTimeString() : "",
  participants: chat.participants || [],
  participantNames: chat.participants.map(p => participantNameMap[p]),
  unreadCount: chat.unreadCounts?.[user] || 0
};

      })
    );

    enrichedChats.sort((a, b) => b.unreadCount - a.unreadCount);
    res.json(enrichedChats);
  } catch (err) {
    console.error("❌ Failed to fetch enriched chats:", err);
    res.status(500).json({ error: "Failed to fetch chats" });
  }
});

// ✅ Send message
router.post("/send", async (req, res) => {
  try {
    const { sender, recipient, department, text } = req.body;

    if (!sender || !recipient || !text) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const participantsSorted = [sender, recipient].sort();
    const normalizedChatId = participantsSorted.join('|');

    console.log("🔄 Saving chat with last message:", text);
    console.log("👤 From:", sender, "To:", recipient);
    console.log("💬 chatId:", normalizedChatId);

    const senderName = await getFullName(sender);
    const receiverName = await getFullName(recipient);
    if (sender === recipient) {
      return res.status(400).json({ error: "Sender and recipient cannot be the same" });
    }
    
    const newMessage = new Message({
      chatId: normalizedChatId,
      sender,
      senderName,
      receiver: recipient,
      receiverName,
      department,
      text,
      timestamp: new Date(),
    });

    await newMessage.save();
    // 🔴 WebSocket broadcast after saving to DB
    const wss = getWSS();
    if (wss) {
    
  const broadcastMessage = {
    type: "chat",
    chatId: normalizedChatId,
    sender,
    senderName,
    recipient,
    receiverName,
    department,
    text,
    timestamp: new Date().toISOString(),
    clientId: Math.random().toString(36).slice(2)
  };

  wss.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(broadcastMessage));
    }
  });
}


    let chat = await Chat.findOne({ chatId: normalizedChatId });
    if (!chat) {
      chat = new Chat({
        chatId: normalizedChatId,
        participants: participantsSorted,
        participantNames: [senderName, receiverName],
        unreadCounts: { [recipient]: 1 },
        lastMessage: text,
        updatedAt: new Date(),
        lastUpdated: new Date(),
      });
    } else {
      chat.lastMessage = text;
      chat.updatedAt = new Date();
      chat.lastUpdated = new Date();
      chat.unreadCounts[recipient] = (chat.unreadCounts[recipient] || 0) + 1;
      chat.markModified("unreadCounts"); // 🔥 This line is crucial
    }

    await chat.save();
    console.log("✅ Chat updated:", {
      chatId: normalizedChatId,
      lastMessage: chat.lastMessage,
      unreadCounts: chat.unreadCounts,
    });

    res.status(200).json({ message: "Message sent", newMessage });
  } catch (err) {
    console.error("❌ Error sending message:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get messages for a chat
router.get("/messages/:chatId", async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    console.error("❌ Error fetching messages:", err);
    res.status(500).send("Server error");
  }
});

// ✅ Mark messages as read
router.put("/read", async (req, res) => {
  try {
    const { chatId, email } = req.body;

    console.log("📥 PUT /read:", { chatId, email });

    if (!chatId || !email) {
      console.log("❌ Missing chatId or email");
      return res.status(400).json({ error: "Missing chatId or email" });
    }

    const chat = await Chat.findOne({ chatId });

    if (!chat) {
      console.log(`❌ Chat not found for chatId: ${chatId}`);
      return res.status(404).json({ error: "Chat not found" });
    }

    if (!chat.unreadCounts) {
      chat.unreadCounts = {};
    }

    chat.unreadCounts[email] = 0;
    chat.markModified("unreadCounts");

    chat.updatedAt = new Date();

    await chat.save();
    console.log(`✅ Marked chat as read for ${email}. Updated unreadCounts:`, chat.unreadCounts);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Error in /read route:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports = router;
