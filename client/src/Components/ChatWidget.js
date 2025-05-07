{/*
import React, { useEffect, useRef, useState } from "react"; 
import { useSelector } from "react-redux";
import { FaComments } from "react-icons/fa";
import io from "socket.io-client";
import axios from "axios";
import { SERVER_URL } from "../config";

const SOCKET_URL = SERVER_URL;
const notificationSound = new Audio("https://notificationsounds.com/storage/sounds/file-sounds-1151-pristine.mp3"); // Simple notification sound

const ChatWidget = () => {
  const user = useSelector((state) => state.users.user);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatUser, setChatUser] = useState("");
  const socketRef = useRef(null);
  const [allUsers, setAllUsers] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0); // Track unread messages
  const [lastSender, setLastSender] = useState(null); // Track last sender for unread
  const [highlight, setHighlight] = useState(false); // Highlight for new message
  // Remove fileInputRef and image upload logic
  // Add refs to track latest open and chatUser
  const openRef = useRef(open);
  const chatUserRef = useRef(chatUser);

  useEffect(() => {
    openRef.current = open;
    if (open) setHighlight(false); // Remove highlight when chat is opened
  }, [open]);
  useEffect(() => {
    chatUserRef.current = chatUser;
  }, [chatUser]);

  // Connect to socket and join room (register event handler only once)
  useEffect(() => {
    if (!user) return;
    socketRef.current = io(SOCKET_URL);
    socketRef.current.emit("join", user._id);
    const handleReceiveMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
      if (!openRef.current || msg.sender !== chatUserRef.current) {
        setUnreadCount((prev) => prev + 1);
        setLastSender(msg.sender);
        setHighlight(true);
        // Improved browser notification logic with more debug logs
        console.log("[ChatWidget] Received message:", msg);
        if (!openRef.current) {
          if (window.Notification) {
            console.log("[ChatWidget] Notification.permission:", Notification.permission);
            if (Notification.permission === "granted") {
              new Notification("New message from " + (allUsers.find(u => u._id === msg.sender)?.name || "User"), {
                body: msg.message,
                icon: "/favicon.ico"
              });
              console.log("[ChatWidget] Notification shown for message:", msg);
            } else if (Notification.permission !== "denied") {
              Notification.requestPermission().then(permission => {
                console.log("[ChatWidget] Notification.requestPermission result:", permission);
                if (permission === "granted") {
                  new Notification("New message from " + (allUsers.find(u => u._id === msg.sender)?.name || "User"), {
                    body: msg.message,
                    icon: "/favicon.ico"
                  });
                  console.log("[ChatWidget] Notification shown after permission granted:", msg);
                } else {
                  console.log("[ChatWidget] Notification permission denied after request.");
                }
              });
            } else {
              console.log("[ChatWidget] Notification permission denied.");
            }
          } else {
            alert("New message: " + msg.message);
            console.log("[ChatWidget] Browser Notification API not available.");
          }
          notificationSound.currentTime = 0;
          notificationSound.play();
        }
      }
    };
    socketRef.current.on("receive_message", handleReceiveMessage);
    return () => {
      socketRef.current.off("receive_message", handleReceiveMessage);
      socketRef.current.disconnect();
    };
  }, [user, allUsers]);

  // Fetch chat history when chatUser changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (user && chatUser) {
        const res = await axios.get(`${SOCKET_URL}/messages/${user._id}/${chatUser}`);
        setMessages(res.data);
        setUnreadCount(0); // Reset unread when switching chat
      }
    };
    fetchMessages();
  }, [user, chatUser]);

  // For demo: show a dropdown to select a chat user (designer or customer)
  useEffect(() => {
    if (!user) return;
    axios.get(`${SERVER_URL}/getAllUsers`).then((res) => {
      setAllUsers(res.data.users.filter((u) => u._id !== user._id));
    });
  }, [user]);

  // Reset unread count when chat is opened
  useEffect(() => {
    if (open) setUnreadCount(0);
  }, [open]);

  // If user is not logged in, do not render the chat widget
  if (!user) return null;

  const handleSend = async () => {
    if (!message.trim() || !chatUser) return;
    const msg = {
      sender: user._id,
      receiver: chatUser,
      message,
      // Remove image property
    };
    socketRef.current.emit("send_message", msg);
    setMessages((prev) => [...prev, { ...msg, timestamp: new Date() }]);
    setMessage("");
  };

  const handleChatIconClick = () => {
    if (unreadCount > 0 && lastSender) {
      setChatUser(lastSender);
      setOpen(true);
    } else {
      setOpen((prev) => !prev);
    }
  };

  return (
    <>
      / Floating chat icon 
      <div
        style={{
          position: "fixed",
          bottom: 30,
          right: 30,
          zIndex: 9999,
        }}
      >
        <div style={{ position: "relative", display: "inline-block" }}>
          <FaComments
            size={38}
            color={highlight ? "#e53935" : "#6a1b9a"}
            style={{
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              borderRadius: "50%",
              background: "#fff",
              padding: 8
            }}
            onClick={handleChatIconClick}
          />
          {unreadCount > 0 && !open && (
            <span
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                background: "#e53935",
                color: "#fff",
                borderRadius: "50%",
                width: 18,
                height: 18,
                fontSize: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                border: "2px solid #fff"
              }}
            >
              {unreadCount}
            </span>
          )}
        </div>
      </div>
      / Chatbox 
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 80,
            right: 30,
            width: 320,
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: 12,
            boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
            zIndex: 10000,
            display: "flex",
            flexDirection: "column",
            height: 400,
          }}
        >
          <div style={{ padding: 10, borderBottom: "1px solid #eee", fontWeight: "bold", background: "#f7f7f7" }}>
            Live Chat
            <span style={{ float: "right", cursor: "pointer" }} onClick={() => setOpen(false)}>&times;</span>
          </div>
          <div style={{ padding: 10, borderBottom: "1px solid #eee" }}>
            <select
              value={chatUser}
              onChange={(e) => setChatUser(e.target.value)}
              style={{ width: "100%", padding: 6, borderRadius: 6 }}
            >
              <option value="">Select user to chat</option>
              {allUsers.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 10, background: "#fafaff" }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  textAlign: msg.sender === user._id ? "right" : "left",
                  margin: "6px 0",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    background: msg.sender === user._id ? "#e1bee7" : "#f3e5f5",
                    color: "#333",
                    borderRadius: 8,
                    padding: "6px 12px",
                    maxWidth: "80%",
                    wordBreak: "break-word",
                  }}
                >
                  {msg.message}
                  / Remove image rendering 
                </span>
                <div style={{ fontSize: 10, color: "#888" }}>
                  {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ""}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", borderTop: "1px solid #eee", padding: 8, alignItems: "center" }}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              style={{ flex: 1, border: "none", outline: "none", padding: 8, borderRadius: 6 }}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={!chatUser}
            />
            /Remove file input and upload button 
            <button
              onClick={handleSend}
              style={{ marginLeft: 8, background: "#6a1b9a", color: "#fff", border: "none", borderRadius: 6, padding: "0 16px" }}
              disabled={(!chatUser || !message.trim())}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;

*/}