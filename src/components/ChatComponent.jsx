import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ChatComponent({ user, department, defaultDepartment }) {
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [input, setInput] = useState('');
  const [typingIndicators, setTypingIndicators] = useState({});
  const [activeChat, setActiveChat] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const manuallyOpenedChat = useRef(false);
  const departmentMapping = {
    'its@lmu.edu': 'vpatel16@lion.lmu.edu',
    'facilities-management@lmu.edu': 'aprabha1@lion.lmu.edu',
    'sodexo@lmu.edu': 'jpatel30@lion.lmu.edu',
    'campus-safety@lmu.edu': 'dpatel52@lion.lmu.edu',
    'marketing@lmu.edu': 'jpancha1@lion.lmu.edu',
    'campus-graphics@lmu.edu': 'aprabha1@lion.lmu.edu',
    'event-organization@lmu.edu': 'jpatel30@lion.lmu.edu',
    'parking@lmu.edu': 'dpatel52@lion.lmu.edu',
  };
  const ws = useRef(null);
  const clientIdRef = useRef(Math.random().toString(36).slice(2));
  const chatEndRef = useRef(null);
  const hasSetInitialChat = useRef(false);
  const autoSelectedInitialChat = useRef(false);


  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || `${process.env.REACT_APP_BACKEND_URL}`;
  const WS_URL = BACKEND_URL.replace(/^http/, 'ws');

  useEffect(() => {
    if (!user) return;

    const fetchChats = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/chat/chats/${user}`);
        const backendChats = await res.json();
        // 🔧 Normalize participants and names alignment
backendChats.forEach(chat => {
  // Step 1: Rebuild participants from email if missing
  if (!chat.participants && chat.email.includes('|')) {
    chat.participants = chat.email.split('|');
  }

  // Step 2: Re-align names to the right participants
  if (chat.participants?.length === 2 && chat.participantNames?.length === 2) {
    const zipped = chat.participants.map((email, i) => ({
      email,
      name: chat.participantNames[i]
    }));

    const sorted = zipped.sort((a, b) => a.email.localeCompare(b.email));

    chat.participants = sorted.map(p => p.email);
    chat.participantNames = sorted.map(p => p.name);
  }
});


        let deptEmail = null;
        if (defaultDepartment) {
          // Prepare default department email
          deptEmail = `${defaultDepartment.toLowerCase().replace(/\s+/g, '-') + '@lmu.edu'}`;
          const exists = backendChats.some(chat => chat.email === deptEmail);
          if (!exists) {
            // Inject a new chat for this department
            const newChat = {
              email: deptEmail,
              lastMsg: '',
              time: '',
              participantNames: [defaultDepartment]
            };
            backendChats.push(newChat);
          }
        }
        // Add "All Messages" option to chats list
        const uniqueChatsMap = new Map(backendChats.map(chat => [chat.email, chat]));
        const uniqueChats = Array.from(uniqueChatsMap.values());


        // ✅ Add fallback for missing data
        uniqueChats.forEach(chat => {
          if (!chat.lastMsg) chat.lastMsg = 'No messages yet';
          if (!chat.time) chat.time = '';
        });

        // ✅ Patch unread counts from backend
        const unreadMap = {};
        uniqueChats.forEach(chat => {
          if (chat.unreadCount > 0 && chat.email !== 'ALL') {
            unreadMap[chat.email] = chat.unreadCount;
          }
        });
        setUnreadCounts(unreadMap);
        setChats(uniqueChats);

        // 🔴 Load unread counts into state
        const newUnread = {};
        uniqueChats.forEach(chat => {
          if (chat.unreadCount > 0 && chat.email !== 'ALL') {
            newUnread[chat.email] = chat.unreadCount;
          }
        });
        setUnreadCounts(newUnread);

        if (!hasSetInitialChat.current) {
          if (deptEmail) {
            autoSelectedInitialChat.current = true;
            setActiveChat(deptEmail);
          } else if (backendChats.length > 0) {
            autoSelectedInitialChat.current = true;
            setActiveChat(backendChats[0].email);
          }
          hasSetInitialChat.current = true;
        }

      } catch (err) {
        console.error("❌ Failed to fetch chats", err);
      }
    };

    fetchChats();
  }, [user, defaultDepartment]);

  useEffect(() => {
    if (!user || !activeChat) return;

    const fetchMessages = async () => {

      try {
        const chatId = [user, activeChat].sort().join('|');
        const res = await fetch(`${BACKEND_URL}/api/chat/messages/${chatId}`);
        if (!res.ok) {
          if (res.status === 404) {
            setMessages([]);
            return;
          }
          throw new Error('Failed to fetch messages');
        }
        const data = await res.json();
        
        setMessages(prev => {
          const existingIds = new Set(data.map(m => m._id));
          const combined = [...data];

          // Add any message that exists locally but hasn't come from DB yet
          for (const msg of prev) {
            if (!msg._id && msg.chatId === chatId) {
              combined.push(msg);
            }
          }

          combined.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
          return combined;
        });
      } catch (err) {
        console.error("❌ Failed to fetch messages", err);
      }
    };

    // Defer fetch slightly to avoid immediate override after sending
    const timeout = setTimeout(fetchMessages, 300);
    return () => clearTimeout(timeout);
  }, [user, activeChat]);

  useEffect(() => {
    if (!user) return;
    const socket = new WebSocket(WS_URL);
    ws.current = socket;

    socket.onopen = () => {
      console.log("✅ WebSocket connected");
    };
    socket.onerror = err => console.error("❌ WebSocket error:", err);
    socket.onclose = () => console.log("🔌 WebSocket disconnected");
    socket.onmessage = event => {
      try {
        const msg = JSON.parse(event.data);
        console.log("📩 Incoming WS message:", msg);
        
        if (msg.type === "typing") {
          setTypingIndicators(prev => ({ ...prev, [msg.sender]: true }));
          setTimeout(() => {
            setTypingIndicators(prev => ({ ...prev, [msg.sender]: false }));
          }, 2000);
          return;
        }

        const isSelf = msg.clientId === clientIdRef.current;
        const isRecipient = msg.recipient === user;
        const isSender = msg.sender === user;
        const chatPartner = isSender ? msg.recipient : msg.sender;
        const chatId = [msg.sender, msg.recipient].sort().join('|');
        const isCurrentChat = activeChat === chatPartner;

        // ✅ Only append if it's not my own message
        if (!isSelf) {
          setMessages(prev => [...prev, msg]);
        }

        // ✅ Only mark as read if it's meant for me AND I'm viewing it
        if (isRecipient && isCurrentChat && !isSelf) {
          fetch(`${BACKEND_URL}/api/chat/read`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chatId, email: user })
          }).then(res => res.json())
            .then(data => console.log("✅ WebSocket-triggered /read success:", data))
            .catch(err => console.error("❌ WebSocket-triggered /read failed:", err));
        }

        // ✅ Update unreadCounts ONLY if it's not me and not open chat
        if (isRecipient && !isCurrentChat && !isSelf) {
          setUnreadCounts(prev => ({
            ...prev,
            [chatPartner]: (prev[chatPartner] || 0) + 1
          }));
        }

        // ✅ Update chat previews
        setChats(prevChats => {
          let updated = false;
          const updatedChats = prevChats.map(chat => {
            if (chat.email === chatPartner || chat.email === [msg.sender, msg.recipient].sort().join('|')) {
              updated = true;
            
              const aligned = [msg.sender, msg.recipient].map((p, i) => ({
                email: p,
                name: [msg.senderName, msg.receiverName][i]
              })).sort((a, b) => a.email.localeCompare(b.email));
            
              return {
                ...chat,
                lastMsg: msg.text,
                time: msg.timestamp,
                participants: aligned.map(p => p.email),
                participantNames: aligned.map(p => p.name)
              };
            }
            
            return chat;
          });
          if (!updated) {
            const participants = [msg.sender, msg.recipient];
            const participantNames = [msg.senderName, msg.receiverName];
          
            const sorted = participants.map((p, i) => ({ email: p, name: participantNames[i] }))
                                       .sort((a, b) => a.email.localeCompare(b.email));
          
            const normalizedParticipants = sorted.map(p => p.email);
            const normalizedNames = sorted.map(p => p.name);
          
            const displayEmail = normalizedParticipants.sort().join('|'); // consistent chatId format

            console.log("🧾 Normalized Chat Insert:", {
              displayEmail,
              participants: normalizedParticipants,
              participantNames: normalizedNames
            });
            
            updatedChats.unshift({
              email: displayEmail,
              lastMsg: msg.text,
              time: msg.timestamp,
              participants: normalizedParticipants,
              participantNames: normalizedNames
            });
            
          }
          

          return updatedChats;
        });

      } catch (err) {
        console.error("📦 WebSocket message parse error:", err);
      }
    };




    return () => socket.close();
  }, [user]);

  useEffect(() => {
    // Auto-scroll to bottom whenever messages update
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getInitials = (nameOrEmail) => {
    try {
      if (!nameOrEmail || typeof nameOrEmail !== 'string') return '??';
      const base = nameOrEmail.includes('@') ? nameOrEmail.split('@')[0] : nameOrEmail;
      const parts = base.split(/[\s._-]+/).filter(Boolean);
      let initials = parts.map(p => p[0]?.toUpperCase()).join('');
      if (initials.length < 2 && base.length >= 2) {
        initials = base.substring(0, 2).toUpperCase();
      }
      return initials.slice(0, 2) || '??';
    } catch {
      return '??';
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const recipient = departmentMapping[activeChat] || activeChat;

    try {
      const res = await fetch(`${BACKEND_URL}/api/chat/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: user,
          recipient,
          department,
          text: input
        })
      });

      const result = await res.json();
      console.log("✅ DB Save Response:", result);
    } catch (err) {
      console.error("❌ Failed to persist message:", err);
    }

    setInput('');
  };



  const handleChatClick = async (email) => {
    if (activeChat === email) return; // ✅ Prevent unnecessary re-trigger

    manuallyOpenedChat.current = true;
    console.log("🖱️ handleChatClick ->", email);
    setActiveChat(email);

    // 🔧 Ensure chat exists in DB
    try {
      const chatId = email; // ✅ it's already in correct format
      const res = await fetch(`${BACKEND_URL}/api/chat/messages/${chatId}`);
      if (res.status === 404) {
        console.log("📦 Chat doesn't exist yet, creating with empty message to initialize");

        await fetch(`${BACKEND_URL}/api/chat/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sender: user,
            recipient: email,
            department: department || "Default",
            text: "[Chat started]"
          })
        });
      }
    } catch (err) {
      console.error("❌ Failed to create initial chat:", err);
    }

    setSidebarOpen(false);

    if (email === 'ALL') {
      console.log("📨 Opening ALL chat, clearing all unread counts");
      setUnreadCounts({});
      return;
    }

    // 👇 Only mark as read if there were unread messages from the other user
    const chatPartner = email;
    const chatId = [user, chatPartner].sort().join('|');
    const isUnreadFromOther = unreadCounts[chatPartner] > 0;

    if (isUnreadFromOther) {
      setUnreadCounts(prev => {
        const updated = { ...prev, [chatPartner]: 0 };
        console.log("📉 Updated local unreadCounts:", updated);
        return updated;
      });

      console.log("📡 Sending PUT /read with", { chatId, email: user });

      try {
        const res = await fetch(`${BACKEND_URL}/api/chat/read`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chatId, email: user })
        });

        const result = await res.json();
        console.log("✅ Backend read response:", result);
      } catch (err) {
        console.error("❌ Failed to mark as read:", err);
      }
    } else {
      console.log("🚫 No unread messages from other user, skipping /read call");
    }
  };



  const handleTyping = (e) => {
    setInput(e.target.value);
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: 'typing', sender: user }));
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[90vh] w-full max-w-6xl rounded-2xl shadow-lg overflow-hidden bg-gradient-to-br from-blue-400 via-blue-200 to-blue-100 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800">
      {/* Mobile Top Bar */}
      <div className="lg:hidden p-2 bg-blue-500 text-white flex items-center">
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu className="w-6 h-6" />
        </button>
        <span className="ml-3 font-semibold text-lg">
          {activeChat ? `Chat with ${activeChat.split('@')[0]}` : 'Select a chat'}
        </span>

      </div>

      {/* Sidebar */}
      <div className={`w-full lg:w-1/4 border-b lg:border-b-0 lg:border-r border-zinc-200 dark:border-zinc-700 p-4 ${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
        <h2 className="text-lg font-bold mb-4 text-zinc-800 dark:text-white">Pending Chats</h2>
        <div className="space-y-3">
          {[...chats]
            .filter(c => c?.email)
            .sort((a, b) => (unreadCounts[b.email] || 0) - (unreadCounts[a.email] || 0))
            .map((chat, i) => {

              const {
                email,
                lastMsg,
                time,
                participants = [],
                participantNames = []
              } = chat;
              let otherName = 'Unknown';

              const lowerUser = user?.toLowerCase();

              if (participants.length === 2 && participantNames.length === 2) {
                const otherIndex = participants.findIndex(p => p.toLowerCase() !== lowerUser);
                if (otherIndex !== -1) {
                  otherName = participantNames[otherIndex];
                }
              } else if (participantNames.length === 1) {
                otherName = participantNames[0];
              } else if (email !== 'ALL') {
                otherName = email.split('@')[0];
              }
              
              console.log("✅ Final Display Pick:", {
                user,
                participants,
                participantNames,
                otherName
              });
              


              return (
                <div
                  key={i}
                  onClick={() => handleChatClick(email)}
                  className={`flex items-center justify-between px-3 py-3 rounded-lg cursor-pointer transition-all hover:bg-blue-100 dark:hover:bg-zinc-700 ${activeChat === email
                    ? 'ring-2 ring-blue-500 bg-blue-200 dark:ring-blue-400 dark:bg-zinc-700'
                    : ''
                    }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative w-10 h-10">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-bold text-xs">
                        {getInitials(otherName)}
                      </div>
                      {(() => {
                        const currentChat = chats.find(c => c.email === email);
                        const participantKey = currentChat?.participants?.find(p => p !== user);
                        const count = unreadCounts[participantKey];

                        return count > 0 ? (
                          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] px-1 rounded-full">
                            {count}
                          </span>
                        ) : null;
                      })()}


                    </div>
                    <div>
                      <div className={`text-sm font-semibold ${unreadCounts[email] > 0
                        ? 'text-blue-900 dark:text-white font-extrabold'
                        : 'text-zinc-800 dark:text-gray-200'
                        }`}>
                        {otherName}
                      </div>

                      <div className="text-xs text-zinc-600 dark:text-gray-400 truncate w-28">
                        {lastMsg || 'No messages yet'}
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400">{time || ''}</div>
                </div>
              );
            })}

        </div>
      </div>

      {/* Chat Panel */}
      <div className="flex flex-col flex-1">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-4 font-semibold text-lg hidden lg:block">
          {activeChat ? (
            activeChat === 'ALL' ? (
              'All Messages'
            ) : (() => {
              const currentChat = chats.find(c => c.email === activeChat);
              if (currentChat && currentChat.participants?.length === 2 && currentChat.participantNames?.length === 2) {
                const userIndex = currentChat.participants.findIndex(
                  p => p.toLowerCase() === user.toLowerCase()
                );
                if (userIndex !== -1) {
                  const otherFullName = currentChat.participantNames[1 - userIndex];
                  return `Chat with ${otherFullName}`;
                }
              } else if (currentChat?.participantNames?.length === 1) {
                return `Chat with ${currentChat.participantNames[0]}`;
              } else {
                return `Chat with ${activeChat.split('@')[0]}`;
              }
            })()
          ) : (
            'Select a chat'
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-br from-blue-100 via-blue-50 to-white dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
          {activeChat ? (
            messages.length > 0 ? (
              messages.map((msg, index) => {
                const isUser = msg.sender === user;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-end gap-2 max-w-xs ${isUser ? 'ml-auto flex-row-reverse' : 'flex-row'}`}
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-bold text-xs">
                      {getInitials(msg.senderName || msg.sender)}
                    </div>
                    <div className={`px-4 py-2 rounded-lg text-sm shadow-md break-words ${isUser ? 'bg-blue-100 dark:bg-blue-700 text-right' : 'bg-gray-100 dark:bg-zinc-700 text-left'}`}>
                      <p className="font-semibold">
                        {msg.senderName || msg.sender}
                      </p>
                      <p>{msg.text}</p>
                      <p className="text-xs mt-1 text-gray-500 dark:text-gray-300">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <p className="text-center text-sm text-zinc-500">No messages yet — start the conversation!</p>
            )
          ) : (
            <p className="text-center text-sm text-zinc-500">← Select a chat to start messaging</p>
          )}
          <div ref={chatEndRef}></div>
        </div>

        {activeChat && (
          <div className="border-t border-zinc-300 dark:border-zinc-700 p-3 flex items-center">
            <input
              type="text"
              value={input}
              onChange={e => handleTyping(e)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              className="flex-1 px-4 py-2 rounded-full border border-gray-300 dark:border-zinc-600 focus:outline-none focus:border-blue-500 dark:bg-zinc-800 dark:text-white"
              placeholder="Type a message..."
            />
            <button onClick={handleSend} className="ml-2 text-blue-600 dark:text-blue-400">
              <Send className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
