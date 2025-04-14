import * as signalR from "@microsoft/signalr";

export const connection = new signalR.HubConnectionBuilder()
  .withUrl("https://localhost:6008/hubs-chat", {
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
