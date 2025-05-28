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
import { useMutation, useQuery } from "@tanstack/react-query";
import { DropdownApi } from "../../apis/dropdown/dropdown";
import queryString from "query-string";
import { buildFormData } from "../../utils/common/buildFormData";
import { toast } from "react-toastify";
import { ChatApi } from "../../apis/chat/chat";
import {
  connection,
  createGroup,
  sendMessageToGroup,
  onReceiveMessage,
  startConnection,
  sendMessage,
} from "../../utils/signalr";
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
  useEffect(() => {
    startConnection();
  }, []);
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
    onReceiveMessage(onPrivateMessage);
    return () => {
      connection.off("ReceiveMessage", onPrivateMessage);
    };
  }, []);
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
  // Fetch users

  const handleSelectUser = (user: any) => {
    setShowUserModal(false);
    setSelectedUser(user);
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
      await sendMessage(message);
      setMessageInput("");
      mutation.mutate({
        receiverId: selectedUser?.id,
        isGroup: selectedUser?.isGroup || false,
        content: messageInput.trim(),
        groupId: selectedUser?.isGroup ? selectedUser?.id : null,
      });
    } catch (error) {
      console.error("Send message failed:", error);
      toast.error("Gửi tin nhắn thất bại");
    }
  };

  const mutation = useMutation({
    mutationFn: async (values: any) => {
      const formD = new FormData();
      buildFormData(formD, values);
      return ChatApi.sendPrivate(formD);
    },
  });
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
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
          {!isMe && <Avatar style={{ marginRight: 8 }} />}
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
      <Layout style={{ height: "calc(100vh - 150px)" }}>
        <Layout.Sider
          width={300}
          theme="light"
          style={{
            borderRight: "1px solid #f0f0f0",
            padding: 10,
            overflowY: "auto",
          }}
        >
          {/* Sider Header */}
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

          {/* Tabs and List */}
          <Tabs defaultActiveKey="1" size="small">
            <Tabs.TabPane tab="Tất cả" key="1">
              <List
                dataSource={conversations}
                renderItem={(user) => (
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
                              user.unreadCount > 0 && currentUser.id !== user.id
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
                )}
              />
            </Tabs.TabPane>
          </Tabs>
        </Layout.Sider>

        <Layout.Content
          style={{
            background: "#fff",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
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

          {/* Message Content */}
          <div
            style={{
              flex: 1,
              padding: 16,
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

          {/* Input */}
          <div
            style={{
              borderTop: "1px solid #eee",
              padding: 10,
              background: "#fff",
            }}
          >
            {typingUser && (
              <Typography.Text type="secondary">
                {typingUser} {"typing..."}
              </Typography.Text>
            )}
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "flex-end",
                marginTop: 8,
              }}
            >
              <Input.TextArea
                placeholder={"Enter message"}
                autoSize={{ minRows: 3, maxRows: 8 }}
                value={messageInput}
                onChange={(e) => {
                  setMessageInput(e.target.value);
                  //handleTyping();
                }}
                disabled={!selectedUser}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                disabled={!messageInput.trim() || !selectedUser}
                onClick={handleSendMessage}
              />
            </div>
          </div>
        </Layout.Content>
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
                avatar={
                  <Avatar src={user.avatar}>{user.fullName?.charAt(0)}</Avatar>
                }
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
        //onOk={handleCreateGroup}
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
