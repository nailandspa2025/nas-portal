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
  console.log("sendMessage", data);
  return connection.invoke("SendMessage", data);
};
