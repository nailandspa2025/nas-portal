/* eslint-disable @typescript-eslint/no-explicit-any */
import * as signalR from "@microsoft/signalr";

export const connection = new signalR.HubConnectionBuilder()
  .withUrl(import.meta.env.VITE_API_CHAT, {
    withCredentials: true,
    accessTokenFactory: () => localStorage.getItem("ACCESS_TOKEN") || "",
  })
  .withAutomaticReconnect()
  .build();

export const startConnection = async () => {
  if (connection.state === "Connected") return;
  if (connection.state === "Disconnected") {
    try {
      await connection.start();
      console.log("✅ SignalR connected");
    } catch (err) {
      console.error("❌ SignalR connection failed:", err);
    }
  }
};

export const onReceiveMessage = (callback: any) => {
  connection.on("ReceiveMessage", callback);
};

export const createGroup = (groupName: string, userIds: string[]) => {
  return connection.invoke("CreateGroup", groupName, userIds);
};

export const sendMessageToGroup = (
  groupName: string,
  userId: string,
  message: string
) => {
  return connection.invoke("SendMessageToGroup", groupName, userId, message);
};

export const sendMessageToUser = (userId: string, message: string) => {
  return connection.invoke("SendMessageToUser", userId, message);
};

export const sendMessage = (data: any) => {
  return connection.invoke("SendMessage", data);
};
let hasRegisteredTypingEvents = false;
export const subscribeTypingEvents = (
  onTyping: (fromUserId: string, conversationId: string) => void,
  onStopTyping: (fromUserId: string, conversationId: string) => void
) => {
  if (!hasRegisteredTypingEvents) {
    connection.on("Typing", onTyping);
    connection.on("StopTyping", onStopTyping);
    hasRegisteredTypingEvents = true;
  }
};
let typingTimeout: NodeJS.Timeout | null = null;
export const handleTyping = (
  toUserId: string,
  conversationId: string,
  messageInput: string
) => {
  if (
    !toUserId ||
    !conversationId ||
    connection.state !== signalR.HubConnectionState.Connected
  )
    return;

  if (!messageInput || messageInput.trim() === "") {
    connection.invoke("StopTyping", toUserId, conversationId);
    if (typingTimeout) {
      clearTimeout(typingTimeout);
      typingTimeout = null;
    }
  } else {
    connection.invoke("Typing", toUserId, conversationId);
    if (typingTimeout) clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      connection.invoke("StopTyping", toUserId, conversationId);
    }, 10000);
  }
};

// export const handleTyping = (toUserId: string, conversationId: string) => {
//   if (
//     !toUserId ||
//     !conversationId ||
//     connection.state !== signalR.HubConnectionState.Connected
//   )
//     return;
//   connection.invoke("Typing", toUserId, conversationId);
//   if (typingTimeout) clearTimeout(typingTimeout);
//   typingTimeout = setTimeout(() => {
//     connection.invoke("StopTyping", toUserId, conversationId);
//   }, 3000);
// };
