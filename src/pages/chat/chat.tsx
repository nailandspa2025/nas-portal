/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Avatar,
  Badge,
  Button,
  Checkbox,
  Input,
  Layout,
  List,
  Modal,
  Tabs,
  Tooltip,
  Typography,
} from "antd";
import {
  UserOutlined,
  SearchOutlined,
  TeamOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { DropdownApi } from "../../apis/dropdown/dropdown";
import queryString from "query-string";
import { Content } from "antd/es/layout/layout";
import { toast } from "react-toastify";
import { connection } from "../../utils/signalr";
import { useSelector } from "react-redux";
const { Title, Text } = Typography;

interface Message {
  content: string;
  senderId: string;
  receiverId?: string;
  groupId?: string;
  timestamp?: string;
  isGroup?: false;
  fullName?: string;
}

const ChatBox = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [showUserModal, setShowUserModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messageInput, setMessageInput] = useState("");
  const [groupMembers, setGroupMembers] = useState<any[]>([]);
  const [groupName, setGroupName] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [userMap, setUserMap] = useState<Record<string, string>>({});
  const [conversations, setConversations] = useState<any[]>([]);

  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const currentUser = useSelector((state: any) => state.auth.user);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  // Connect SignalR
  useEffect(() => {
    if (connection.state === "Disconnected") {
      connection.on("Typing", (fromUserId: string) => {
        setTypingUser(fromUserId);
      });
      connection.on("StopTyping", (fromUserId: string) => {
        console.log(`${fromUserId} ngừng gõ`);
        setTypingUser(null);
      });
      connection
        .start()
        .then(() => console.log("SignalR connected"))
        .catch((err) => console.error("SignalR connection error: ", err));
    }

    return () => {
      connection.stop();
    };
  }, []);

  // Receive messages
  useEffect(() => {
    const onPrivateMessage = (message: Message) => {
      // Cập nhật danh sách tin nhắn
      setMessages((prev) => [...prev, message]);

      const conversationId = message.isGroup
        ? message.groupId
        : message.senderId;

      setConversations((prev) => {
        // Kiểm tra xem conversation đã tồn tại chưa
        const exists = prev.find((conv) => conv.id === conversationId);
        if (exists) {
          return prev.map((conv) => {
            if (conv.id === conversationId) {
              return {
                ...conv,
                unreadCount: conv.unreadCount + 1,
                lastMessage: message,
              };
            }
            return conv;
          });
        }

        // Nếu chưa tồn tại, thêm mới conversation
        return [
          ...prev,
          {
            id: conversationId,
            message: message.content,
            timestamp: new Date().toLocaleTimeString(),
            unreadCount: 1,
            receiverId: message.receiverId,
          },
        ];
      });
    };

    // Lắng nghe sự kiện nhận tin nhắn
    connection.on("ReceiveMessage", onPrivateMessage);

    // Cleanup
    return () => {
      connection.off("ReceiveMessage", onPrivateMessage);
    };
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch users
  const { data: users } = useQuery({
    queryKey: ["userOption", searchText],
    queryFn: () =>
      DropdownApi.getUsers(
        queryString.stringify({ page: 1, pageSize: 20, searchText })
      ),
  });

  useEffect(() => {
    if ((users as any)?.data?.items) {
      const map = (users as any).data.items.reduce((acc: any, u: any) => {
        acc[u.id] = u.fullName;
        return acc;
      }, {});
      setUserMap(map);
    }
  }, [users]);

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    setShowUserModal(false);
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === user.id ? { ...conv, unreadCount: 0 } : conv
      )
    );
  };
  const handleCreateGroup = async () => {
    if (groupMembers.length > 1) {
      const groupId = `group-${Date.now()}`;
      const name =
        groupName.trim() || groupMembers.map((u) => u.fullName).join(", ");
      const members = [
        ...groupMembers,
        {
          id: currentUser.id,
          fullName: currentUser.fullName,
        },
      ];
      const newGroup = {
        id: groupId,
        fullName: name,
        isGroup: true,
        members,
        groupId,
      };
      if (connection.state === "Connected") {
        try {
          await connection.invoke("JoinGroup", groupId);
        } catch (err) {
          console.error("Failed to join group:", err);
        }
      }
      setSelectedUser(newGroup);
      setGroupName("");
      setGroupMembers([]);
      setShowGroupModal(false);
    } else {
      toast.error("Chọn ít nhất 2 người để tạo nhóm");
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedUser) return;

    const message = {
      content: messageInput.trim(),
      receiverId: selectedUser?.isGroup ? null : selectedUser?.id,
      groupId: selectedUser?.isGroup ? selectedUser?.id : null,
      timestamp: new Date().toLocaleTimeString(),
      senderId: currentUser.id,
      sendName: currentUser.fullName,
      isGroup: selectedUser?.isGroup || false,
    };
    setMessages((prev) => [...prev, message]);

    setConversations((prev) => {
      const receiverId = selectedUser?.isGroup ? null : selectedUser?.id;
      const exists = prev.find((conv) => conv.id === receiverId);
      if (exists) {
        return prev.map((conv) => {
          if (conv.id === receiverId) {
            return {
              ...conv,
              message: messageInput.trim(),
              timestamp: new Date().toLocaleTimeString(),
            };
          }
          return conv;
        });
      }
      return [
        ...prev,
        {
          id: receiverId,
          sendName: currentUser.fullName,
          isGroup: selectedUser?.isGroup ? selectedUser?.id : null,
          unreadCount: 0,
          message: messageInput.trim(),
          timestamp: new Date().toLocaleTimeString(),
          senderId: currentUser.id,
        },
      ];
    });

    if (connection.state !== "Connected") {
      toast.error("Không thể gửi tin nhắn: Kết nối chưa sẵn sàng.");
      try {
        await connection.start();
        console.log("Reconnected to SignalR");
      } catch (err) {
        console.error("Reconnect failed:", err);
        return;
      }
    }

    try {
      //   if (selectedUser?.isGroup) {
      //     await connection.invoke("JoinGroup", selectedUser.groupId);
      //   }
      //   if (selectedUser?.isGroup) {
      //     const joinPromises = selectedUser.members.map(async (item: any) => {
      //       try {
      //         await connection.invoke("JoinGroup", item.id); // Tham gia nhóm cho từng thành viên
      //         console.log(`${item.fullName} joined the group.`);
      //       } catch (err) {
      //         console.error(`Failed to join group for ${item.fullName}:`, err);
      //       }
      //     });
      //     // Đợi tất cả các lời gọi JoinGroup hoàn tất
      //     await Promise.all(joinPromises);
      //   }
      await connection.invoke("SendMessage", message);
      setMessageInput("");
    } catch (error) {
      console.error("Send message failed:", error);
      toast.error("Gửi tin nhắn thất bại");
    }
  };

  console.log("select", selectedUser);
  const handleToggleGroupUser = (user: any) => {
    setGroupMembers((prev) => {
      const exists = prev.find((u) => u.id === user.id);
      return exists ? prev.filter((u) => u.id !== user.id) : [...prev, user];
    });
  };
  let typingTimeout: NodeJS.Timeout;
  const handleTyping = () => {
    if (connection && selectedUser.id) {
      connection.invoke("Typing", selectedUser.id);
      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => {
        connection.invoke("StopTyping", selectedUser.id);
      }, 5000);
    }
  };
  const renderMessages = () => {
    if (!messages.length) {
      return <Text type="secondary">Không có nội dung</Text>;
    }
    const filteredMessages = messages.filter(
      (msg) =>
        (msg.senderId === currentUser?.id &&
          msg.receiverId === selectedUser?.id) ||
        (msg.senderId === selectedUser?.id &&
          msg.receiverId === currentUser?.id)
    );

    if (!filteredMessages.length) {
      return <Text type="secondary">Không có nội dung</Text>;
    }
    return filteredMessages.map((msg, idx) => {
      const isMe = msg.senderId === currentUser?.id;
      return (
        <div
          key={idx}
          style={{
            display: "flex",
            justifyContent: isMe ? "flex-end" : "flex-start",
            marginBottom: 8,
          }}
        >
          <div
            style={{
              maxWidth: "80%",
            }}
          >
            {msg.isGroup && <div>{userMap[msg.senderId] || msg.senderId}</div>}
            <div
              style={{
                padding: 10,
                borderRadius: 8,
                background: isMe ? "#d9f7be" : "#f0f0f0",
              }}
            >
              {msg.content}
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <>
      <Layout>
        <Layout.Sider
          width={300}
          theme="light"
          style={{ borderRight: "1px solid #f0f0f0", padding: 10 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 10,
            }}
          >
            <Input
              placeholder="Search"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ flex: 1 }}
            />
            <Tooltip title="User">
              <Button
                icon={<UserOutlined />}
                onClick={() => setShowUserModal(true)}
              />
            </Tooltip>
            <Tooltip title="Group">
              <Button
                icon={<TeamOutlined />}
                onClick={() => setShowGroupModal(true)}
              />
            </Tooltip>
          </div>
          <Tabs defaultActiveKey="1" size="small">
            <Tabs.TabPane tab="Tất cả" key="1">
              <List
                dataSource={conversations}
                renderItem={(user) => {
                  return (
                    <List.Item
                      onClick={() => handleSelectUser(user)}
                      style={{
                        paddingLeft: 10,

                        cursor: "pointer",
                        background:
                          selectedUser?.id === user.id ? "#f0f0f0" : undefined,
                      }}
                    >
                      <List.Item.Meta
                        style={{ paddingRight: 10 }}
                        avatar={<Avatar icon={<UserOutlined />} />}
                        title={
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Badge
                              count={
                                user.unreadCount > 0 &&
                                currentUser.id !== user.id
                                  ? user.unreadCount
                                  : 0
                              }
                              offset={[8, 0]}
                            >
                              <span>{userMap[user.id]}</span>
                            </Badge>
                            <span style={{ fontSize: 12, color: "#888" }}>
                              {user.timestamp}
                            </span>
                          </div>
                        }
                        description={
                          <span
                            style={{
                              color: "#555",
                              fontSize: 12,
                              display: "-webkit-box",
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {user.lastMessage?.content || user.message}
                          </span>
                        }
                      />
                    </List.Item>
                  );
                }}
              />
            </Tabs.TabPane>
          </Tabs>
        </Layout.Sider>

        <Content style={{ background: "#fff" }}>
          <div style={{ padding: 16, borderBottom: "1px solid #f0f0f0" }}>
            {selectedUser ? (
              <Title level={5} style={{ margin: 0 }}>
                {selectedUser.fullName}
                {selectedUser.isGroup && selectedUser.members?.length ? (
                  <span
                    style={{
                      fontWeight: "normal",
                      marginLeft: 8,
                      fontSize: 14,
                    }}
                  >
                    ({selectedUser.members.length} thành viên)
                  </span>
                ) : null}
              </Title>
            ) : (
              <Title level={5} style={{ margin: 0 }}>
                Chọn người hoặc nhóm để bắt đầu trò chuyện
              </Title>
            )}
          </div>

          <div
            style={{
              padding: 16,
              height: "calc(100vh - 150px)",
              overflowY: "auto",
            }}
          >
            {selectedUser ? (
              renderMessages()
            ) : (
              <Text type="secondary">Không có nội dung</Text>
            )}
            <div ref={messageEndRef} />
          </div>

          <div
            style={{
              borderTop: "1px solid #eee",
              padding: "10px",
              background: "#fff",
              position: "sticky",
              bottom: 40,
            }}
          >
            {typingUser && (
              <Typography.Text type="secondary">
                {typingUser} {"typing..."}
              </Typography.Text>
            )}
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
              <Input.TextArea
                placeholder={"Enter message"}
                autoSize={{ minRows: 2, maxRows: 4 }}
                value={messageInput}
                onChange={(e) => {
                  setMessageInput(e.target.value);
                  handleTyping();
                }}
                disabled={!selectedUser}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSendMessage}
                disabled={!messageInput.trim() || !selectedUser}
              />
            </div>
          </div>
        </Content>
      </Layout>

      {/* Modal chọn người */}
      <Modal
        title="Chọn người để nhắn tin"
        open={showUserModal}
        onCancel={() => setShowUserModal(false)}
        footer={null}
      >
        <Input
          placeholder="Tìm người dùng"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ marginBottom: 10 }}
        />
        <List
          dataSource={(users as any)?.data?.items || []}
          renderItem={(user: any) => (
            <List.Item
              onClick={() => handleSelectUser(user)}
              style={{
                cursor: "pointer",
                padding: "10px",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <List.Item.Meta
                avatar={<Avatar>{user.fullName[0]}</Avatar>}
                title={user.fullName}
              />
            </List.Item>
          )}
        />
      </Modal>

      {/* Modal tạo nhóm */}
      <Modal
        title="Tạo nhóm"
        open={showGroupModal}
        onCancel={() => setShowGroupModal(false)}
        onOk={handleCreateGroup}
        okText="Tạo nhóm"
      >
        <Input
          placeholder="Tên nhóm (tùy chọn)"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          style={{ marginBottom: 10 }}
        />
        <List
          dataSource={(users as any)?.data?.items || []}
          renderItem={(user: any) => (
            <List.Item
              onClick={() => handleToggleGroupUser(user)}
              style={{
                cursor: "pointer",
                background: groupMembers.some((u) => u.id === user.id)
                  ? "#e6f7ff"
                  : "transparent",
              }}
            >
              <Checkbox
                style={{
                  paddingRight: 10,
                }}
                checked={groupMembers.some((u) => u.id === user.id)}
              />
              <List.Item.Meta
                avatar={<Avatar>{user.fullName[0]}</Avatar>}
                title={user.fullName}
              />
            </List.Item>
          )}
        />
      </Modal>
    </>
  );
};

export default ChatBox;
