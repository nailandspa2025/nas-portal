// ChatApp.tsx
import React, { useEffect, useState } from "react";
import {
  Layout,
  Input,
  Tabs,
  List,
  Avatar,
  Typography,
  Button,
  Tooltip,
  Modal,
  message as antdMessage,
  Badge,
  Checkbox,
} from "antd";
import {
  UserOutlined,
  TeamOutlined,
  SearchOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DropdownApi } from "../../apis/dropdown/dropdown";
import queryString from "query-string";
import * as signalR from "@microsoft/signalr";
import { buildFormData } from "../../utils/common/buildFormData";
import { ChatApi } from "../../apis/chat/chat";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const { Sider, Content } = Layout;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

export default function ChatApp() {
  const currentUserId = useSelector((state: any) => state.auth.user?.id);
  const [searchUser, setSearchUser] = useState("");
  const [searchText, setSearchText] = useState("");
  const [showUserModal, setShowUserModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [groupMembers, setGroupMembers] = useState<any[]>([]);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const [messages, setMessages] = useState<any>({});
  const [messageInput, setMessageInput] = useState("");
  const [conversations, setConversations] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<{ [userId: string]: number }>(
    {}
  );

  const isGroup = selectedUser?.isGroup;

  const { data: users } = useQuery({
    queryKey: ["userOption", searchUser],
    queryFn: () =>
      DropdownApi.getUsers(
        queryString.stringify({ page: 1, pageSize: 20, searchText: searchUser })
      ),
  });
  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:6008/hubs-chat", {
        withCredentials: true,
        accessTokenFactory: () => localStorage.getItem("ACCESS_TOKEN") || "",
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    newConnection
      .start()
      .then(() => {
        console.log("Connected to SignalR");

        newConnection.on("MessagePrivate", (message) => {
          const receiverKey =
            message.fromUserId === currentUserId
              ? message.receiverId
              : message.fromUserId;

          setMessages((prev) => ({
            ...prev,
            [receiverKey]: [...(prev[receiverKey] || []), message],
          }));

          if (
            !selectedUser ||
            (selectedUser.id !== message.fromUserId &&
              selectedUser.id !== message.receiverId)
          ) {
            setUnreadCount((prev) => ({
              ...prev,
              [receiverKey]: (prev[receiverKey] || 0) + 1,
            }));
          }
        });

        newConnection.on("MessageGroup", (message) => {
          const groupKey = `group-${message.receiverId}`;
          setMessages((prev) => ({
            ...prev,
            [groupKey]: [...(prev[groupKey] || []), message],
          }));

          if (!selectedUser || selectedUser.id !== message.receiverId) {
            setUnreadCount((prev) => ({
              ...prev,
              [groupKey]: (prev[groupKey] || 0) + 1,
            }));
          }
        });
      })
      .catch((err) => console.error("SignalR Connection Error:", err));

    return () => {
      newConnection.stop();
    };
  }, [currentUserId, selectedUser]);

  const mutation = useMutation({
    mutationFn: async (values: any) => {
      const formD = new FormData();
      buildFormData(formD, values);
      return await ChatApi.sendPrivate(formD);
    },
    onSuccess: (res: any) => {
      if (res.succeeded) {
        const msg = res.data;
        const receiverKey = isGroup
          ? `group-${msg.receiverId}`
          : msg.receiverId;
        setMessages((prev) => ({
          ...prev,
          [receiverKey]: [...(prev[receiverKey] || []), msg],
        }));
        setMessageInput("");
        setConversations((prev) => {
          const exists = prev.find((conv) => conv.id === msg.receiverId);
          return exists
            ? prev
            : [...prev, { id: msg.receiverId, fullName: msg.sendName }];
        });
      }
    },
    onError: () => antdMessage.error("Gửi tin nhắn thất bại"),
  });

  const handleSendMessage = () => {
    if (messageInput.trim() && selectedUser) {
      const payload = {
        receiverId: selectedUser.id,
        content: messageInput,
        fileUrl: null,
        isGroup: selectedUser?.isGroup || false,
      };
      mutation.mutate(payload);
    }
  };

  const handleSelectUser = (user: any) => {
    const receiverKey = user.isGroup ? `group-${user.id}` : user.id;
    setSelectedUser(user);
    setUnreadCount((prev) => ({
      ...prev,
      [receiverKey]: 0,
    }));
    setShowUserModal(false);
    setShowGroupModal(false);
  };

  const handleToggleGroupUser = (user: any) => {
    setGroupMembers((prev) => {
      const exists = prev.find((u) => u.id === user.id);
      if (exists) return prev.filter((u) => u.id !== user.id);
      return [...prev, user];
    });
  };

  const handleCreateGroup = () => {
    if (groupMembers.length > 1) {
      const groupId = `group-${Date.now()}`;
      const groupName = groupMembers.map((u) => u.fullName).join(", ");
      const newGroup = { id: groupId, fullName: groupName, isGroup: true };
      setConversations((prev) => [...prev, newGroup]);
      setSelectedUser(newGroup);
      setMessages((prev) => ({ ...prev, [groupId]: [] }));
      setShowGroupModal(false);
    } else {
      toast.error("Chọn ít nhất 2 người ");
    }
  };

  const sendPrivateMessage = (receiverId: string, content: string) => {
    if (connection) {
      const message = {
        fromUserId: currentUserId,
        receiverId,
        content,
        sentAt: new Date().toISOString(),
        type: "private", // nếu cần
      };

      connection
        .invoke("SendPrivateMessageAsync", receiverId, message)
        .catch((err) => console.error("SendPrivateMessage error:", err));

      // Optional: cập nhật UI ngay lập tức
      setMessages((prev) => ({
        ...prev,
        [receiverId]: [...(prev[receiverId] || []), message],
      }));
    }
  };
  const sendGroupMessage = (groupId: string, content: string) => {
    if (connection) {
      const message = {
        fromUserId: currentUserId,
        receiverId: groupId,
        content,
        sentAt: new Date().toISOString(),
        type: "group",
      };

      connection
        .invoke("SendGroupMessageAsync", groupId, message)
        .catch((err) => console.error("SendGroupMessage error:", err));

      const groupKey = `group-${groupId}`;
      setMessages((prev) => ({
        ...prev,
        [groupKey]: [...(prev[groupKey] || []), message],
      }));
    }
  };
  const sendMessage = (message: any) => {
    if (!connection) return;

    if (message.type === "group") {
      connection.invoke("SendGroupMessageAsync", message.receiverId, message);
    } else {
      connection.invoke("SendPrivateMessageAsync", message.receiverId, message);
    }
  };

  //   const sendMessage = (
  //     receiverId: string,
  //     content: string,
  //     isGroup = false
  //   ) => {
  //     const message = {
  //       fromUserId: currentUserId,
  //       receiverId,
  //       content,
  //       sentAt: new Date().toISOString(),
  //       type: isGroup ? "group" : "private",
  //     };

  //     if (!connection) return;

  //     if (isGroup) {
  //       connection.invoke("SendGroupMessageAsync", receiverId, message);
  //       const groupKey = `group-${receiverId}`;
  //       setMessages((prev) => ({
  //         ...prev,
  //         [groupKey]: [...(prev[groupKey] || []), message],
  //       }));
  //     } else {
  //       connection.invoke("SendPrivateMessageAsync", receiverId, message);
  //       setMessages((prev) => ({
  //         ...prev,
  //         [receiverId]: [...(prev[receiverId] || []), message],
  //       }));
  //     }
  //   };

  const renderMessages = () => {
    if (!selectedUser) return null;
    const receiverKey = selectedUser?.isGroup
      ? `group-${selectedUser.id}`
      : selectedUser.id;
    const userMessages = messages[receiverKey] || [];
    return userMessages.map((msg, idx) => (
      <div key={idx} style={{ marginBottom: 10 }}>
        <Avatar
          icon={<UserOutlined />}
          size="small"
          style={{ marginRight: 8 }}
        />
        <div
          style={{
            background:
              msg.fromUserId === currentUserId ? "#e6f4ff" : "#f5f5f5",
            padding: 10,
            borderRadius: 8,
            display: "inline-block",
          }}
        >
          <Text>{msg.content}</Text>
        </div>
      </div>
    ));
  };

  return (
    <Layout style={{ height: "calc(100vh - 35px)" }}>
      <Sider
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
            placeholder="Tìm kiếm"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ flex: 1 }}
          />
          <Tooltip title="Cá nhân">
            <Button
              icon={<UserOutlined />}
              onClick={() => setShowUserModal(true)}
            />
          </Tooltip>
          <Tooltip title="Tạo nhóm">
            <Button
              icon={<TeamOutlined />}
              onClick={() => setShowGroupModal(true)}
            />
          </Tooltip>
        </div>

        <Tabs defaultActiveKey="1" size="small">
          <TabPane tab="Tất cả" key="1">
            <List
              dataSource={conversations}
              renderItem={(user) => {
                const receiverKey = user.isGroup ? `group-${user.id}` : user.id;
                return (
                  <List.Item
                    onClick={() => handleSelectUser(user)}
                    style={{
                      cursor: "pointer",
                      background:
                        selectedUser?.id === user.id ? "#f0f0f0" : undefined,
                    }}
                  >
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={
                        <Badge
                          count={unreadCount[receiverKey] || 0}
                          offset={[8, 0]}
                        >
                          {user.fullName}
                        </Badge>
                      }
                    />
                  </List.Item>
                );
              }}
            />
          </TabPane>
        </Tabs>
      </Sider>

      <Content style={{ background: "#fff" }}>
        <div style={{ padding: 16, borderBottom: "1px solid #f0f0f0" }}>
          {selectedUser ? (
            <>
              <Title level={5} style={{ margin: 0 }}>
                {selectedUser.fullName}
              </Title>
            </>
          ) : (
            <Title level={5}>Chọn người hoặc nhóm để bắt đầu trò chuyện</Title>
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
        </div>

        <div
          style={{
            borderTop: "1px solid #eee",
            padding: "10px",
            background: "#fff",
            bottom: 40,
            position: "sticky",
          }}
        >
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <Input.TextArea
              placeholder="Nhập tin nhắn..."
              autoSize={{ minRows: 2, maxRows: 4 }}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
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

      {/* Modal chọn user */}
      <Modal
        title="Chọn người để nhắn tin"
        open={showUserModal}
        onCancel={() => setShowUserModal(false)}
        footer={null}
      >
        <Input
          placeholder="Tìm người dùng"
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          style={{ marginBottom: 10 }}
        />
        <List
          dataSource={users?.data?.items || []}
          renderItem={(user) => (
            <List.Item
              onClick={() => handleSelectUser(user)}
              style={{ cursor: "pointer" }}
            >
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={user.fullName}
              />
            </List.Item>
          )}
        />
      </Modal>

      {/* Modal tạo nhóm */}
      <Modal
        title="Tạo nhóm mới"
        open={showGroupModal}
        onCancel={() => setShowGroupModal(false)}
        onOk={handleCreateGroup}
        okText="Tạo nhóm"
        cancelText="Hủy"
      >
        <Input
          placeholder="Tìm người dùng"
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          style={{ marginBottom: 10 }}
        />
        <List
          dataSource={users?.data?.items || []}
          renderItem={(user) => (
            <List.Item>
              <Checkbox
                checked={groupMembers.some((u) => u.id === user.id)}
                onChange={() => handleToggleGroupUser(user)}
              >
                {user.fullName}
              </Checkbox>
            </List.Item>
          )}
        />
      </Modal>
    </Layout>
  );
}
