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
  Typography,
  Upload,
  Image,
  Space,
} from "antd";
import {
  UserOutlined,
  SearchOutlined,
  SendOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { useEffect, useState, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DropdownApi } from "../../apis/dropdown/dropdown";
import queryString from "query-string";
import { buildFormData } from "../../utils/common/buildFormData";
import { toast } from "react-toastify";
import { ChatApi } from "../../apis/socket/chat";
import dayjs from "dayjs";
import {
  connection,
  createGroup,
  onReceiveMessage,
  startConnection,
  sendMessage,
  handleTyping,
} from "../../utils/signalr";
import { useSelector } from "react-redux";
const { Title, Text } = Typography;
const ChatBox = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [showUserModal, setShowUserModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messageInput, setMessageInput] = useState("");
  const [groupMembers, setGroupMembers] = useState<any[]>([]);
  const [groupName, setGroupName] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [activeKey, setActiveKey] = useState("1");
  const [conversations, setConversations] = useState<any[]>([]);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const currentUser = useSelector((state: any) => state.auth.user);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [uploadKey, setUploadKey] = useState(0);
  useEffect(() => {
    startConnection();
    onReceiveMessage(onPrivateMessage);
  }, []);
  useEffect(() => {
    setTypingUser(null);
    const handlerTyping = (fromUserId: string, conversationId: string) => {
      if (conversationId === selectedUser?.conversationId) {
        setTypingUser(fromUserId);
      }
    };
    const handlerStopTyping = (fromUserId: string, conversationId: string) => {
      if (conversationId == selectedUser?.conversationId) {
        setTypingUser(null);
        console.log("canhlv", fromUserId);
      }
    };
    connection.on("Typing", handlerTyping);
    connection.on("StopTyping", handlerStopTyping);
    return () => {
      connection.off("Typing", handlerTyping);
      connection.off("StopTyping", handlerStopTyping);
    };
  }, [selectedUser?.conversationId]);

  const { data: dataConversations } = useQuery({
    queryKey: ["dataConversations", searchText],
    queryFn: async () => {
      const res: any = await ChatApi.getWithPagination(
        queryString.stringify({ page: 1, pageSize: 100 })
      );
      return res?.data?.items || [];
    },
  });

  const { data: users } = useQuery({
    queryKey: ["userOption", searchText],
    queryFn: async () => {
      const res: any = await DropdownApi.getUsers(
        queryString.stringify({ page: 1, pageSize: 100, searchText })
      );
      const items = res?.data?.items || [];
      return items.filter((user: any) => user.id !== currentUser.id);
    },
    //enabled: !!currentUser.id,
  });
  const { data: messageDetail } = useQuery({
    queryKey: ["messageDetail", chatId],
    queryFn: async () => {
      const res: any = await ChatApi.detail(
        queryString.stringify({
          senderId: selectedUser?.senderId,
          receiverId: selectedUser?.receiverId,
          groupId: selectedUser?.groupId,
        })
      );
      return res?.data || [];
    },
    enabled: !!chatId,
  });
  const mutation = useMutation({
    mutationFn: async (values: any) => {
      const formD = new FormData();
      buildFormData(formD, values);
      return ChatApi.sendPrivate(formD);
    },
    onSuccess: (res: any) => {
      console.log("res", res);
      handleSendMessageSingR({
        files: res.data.files,
        content: res.data.content,
      });
    },
  });
  useEffect(() => {
    if (dataConversations) {
      setConversations(dataConversations);
    }
    if (messageDetail) {
      setMessages(messageDetail);
    }
  }, [dataConversations, messageDetail]);
  // Fetch users
  const handleSelectUser = (user: any) => {
    setShowUserModal(false);
    setActiveKey("1");
    setSelectedUser({
      ...user,
      receiverId: user.id,
      senderId: currentUser.id,
      receiverInfo: {
        avatar: user?.avatar,
        fullName: user?.fullName,
        id: user.id,
      },
      senderInfo: {
        avatar: currentUser?.avatar,
        fullName: currentUser.fullName,
        id: currentUser.id,
      },
      conversationId: getConversationKey(currentUser.id, user.id),
    });
  };
  const handleDetail = (item: any) => {
    const isMeSender = item.senderId === currentUser?.id;
    const senderId = currentUser.id;
    const receiverId = isMeSender ? item.receiverId : item.senderId;
    const senderInfo = isMeSender ? item.senderInfo : item.receiverInfo;
    const receiverInfo = isMeSender ? item.receiverInfo : item.senderInfo;
    const conversationId =
      item.conversationId ?? getConversationKey(senderId, receiverId);
    setSelectedUser({
      ...item,
      senderId,
      receiverId,
      senderInfo,
      receiverInfo,
      conversationId,
    });
    setChatId(conversationId);
    if (item.isGroup) {
      createGroup(item.groupId, item.userIds);
    }
  };
  const getConversationKey = (senderId: string, receiverId: string) => {
    return [senderId, receiverId].sort().join("_");
  };
  const handleConversation = (item: any) => {
    const isGroup = item.isGroup || false;
    const isMeSender = item.senderId === currentUser.id;
    const id = isGroup
      ? item.groupId
      : getConversationKey(item.senderId, item.receiverId);
    setConversations((prev) => {
      const exists = prev.find((conv) => conv.conversationId === id);
      if (exists) {
        return prev.map((conv) =>
          conv.conversationId === id
            ? {
                ...conv,
                unreadCount: !isMeSender
                  ? conv.unreadCount + 1
                  : conv.unreadCount,
                content: item.content,
                created: new Date(),
              }
            : conv
        );
      }
      return [
        ...prev,
        {
          id: item.id,
          conversationId: id,
          content: item.content,
          created: new Date(),
          unreadCount: !isMeSender ? 1 : 0,
          receiverId: item.receiverId,
          senderId: item.senderId,
          receiverInfo: item.receiverInfo,
          senderInfo: item.senderInfo,
          isGroup: item.isGroup || false,
        },
      ];
    });
  };
  const handleMessage = (item: any) => {
    const isMeSender = selectedUser.senderId === currentUser?.id;
    const data = {
      ...selectedUser,
      content: item.message,
      receiverId: isMeSender ? selectedUser.receiverId : selectedUser.senderId,
      groupId: selectedUser?.isGroup ? selectedUser?.id : null,
      creted: new Date(),
      senderId: currentUser.id,
      files: item?.files,
      conversationId:
        selectedUser?.conversationId ??
        getConversationKey(currentUser.id, selectedUser.receiverId),
    };
    setMessages((prev) => [...prev, data]);
  };

  const onPrivateMessage = (message: any) => {
    setMessages((prev) => [...prev, message]);
    handleConversation(message);
  };
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedUser) return;
    const isMeSender = selectedUser.senderId === currentUser?.id;
    const message = {
      ...selectedUser,
      content: messageInput.trim(),
      receiverId: isMeSender ? selectedUser.receiverId : selectedUser.senderId,
      groupId: selectedUser?.isGroup ? selectedUser?.id : null,
      creted: new Date().toLocaleTimeString(),
      senderId: currentUser.id,
      conversationId:
        selectedUser?.conversationId ??
        getConversationKey(currentUser.id, selectedUser.receiverId),
    };
    setMessages((prev) => [...prev, message]);
    handleConversation(message);
    if (connection.state !== "Connected") {
      toast.error("Không thể gửi tin nhắn: Kết nối chưa sẵn sàng.");
      try {
        await connection.start();
      } catch (err) {
        console.error("Reconnect failed:", err);
        return;
      }
    }
    try {
      setMessageInput("");
      handleInputChange("");
      mutation.mutate({
        receiverId: isMeSender
          ? selectedUser.receiverId
          : selectedUser.senderId,
        isGroup: selectedUser?.isGroup || false,
        content: messageInput.trim(),
        groupId: selectedUser?.groupId ? selectedUser?.groupId : null,
        files: null,
      });
    } catch (error) {
      console.error("Send message failed:", error);
      toast.error("Gửi tin nhắn thất bại");
    }
  };
  const handleSendMessageSingR = async (item: any) => {
    const isMeSender = selectedUser.senderId === currentUser?.id;
    const data = {
      receiverInfo: {
        avatar: selectedUser.receiverInfo.avatar,
        fullName: selectedUser.receiverInfo.fullName,
        id: selectedUser.receiverInfo.id,
      },
      senderInfo: {
        avatar: selectedUser.senderInfo.avatar,
        fullName: selectedUser.senderInfo.fullName,
        id: selectedUser.senderInfo.id,
      },
      receiverId: isMeSender ? selectedUser.receiverId : selectedUser.senderId,
      isGroup: selectedUser?.isGroup || false,
      content: item?.content,
      files: item?.files,
      groupId: selectedUser?.groupId ? selectedUser?.groupId : null,
      senderId: currentUser.id,
      conversationId:
        selectedUser?.conversationId ??
        getConversationKey(currentUser.id, selectedUser.receiverId),
    };
    await sendMessage(data);
  };

  const mutationGroup = useMutation({
    mutationFn: async (values: any) => {
      const formD = new FormData();
      buildFormData(formD, values);
      return ChatApi.createGroup(formD);
    },
    onSuccess: (res: any) => {
      if (res.succeeded) {
        const newGroup = {
          id: res.data.id,
          name: res.data.name,
          fullName: res.data.name,
          isGroup: true,
          members: res.data.userIds,
          groupId: res.data.id,
        };
        setSelectedUser(newGroup);
        setGroupName("");
        setGroupMembers([]);
        setShowGroupModal(false);
      }
    },
  });
  const handleInputChange = (message: any) => {
    const targetUserId =
      currentUser?.id === selectedUser.senderId
        ? selectedUser.receiverId
        : selectedUser.senderId;
    const conversationId = selectedUser.conversationId;
    handleTyping(targetUserId, conversationId, message);
  };

  const handleCreateGroup = async () => {
    if (groupMembers.length > 1) {
      const payload = {
        groupName:
          groupName.trim() || groupMembers.map((u) => u.fullName).join(", "),
        userIds: groupMembers.map((m) => m.id),
      };
      mutationGroup.mutate(payload);
    } else {
      toast.error("Chọn ít nhất 2 người để tạo nhóm");
    }
  };
  const handleToggleGroupUser = (user: any) => {
    setGroupMembers((prev) => {
      const exists = prev.find((u) => u.id === user.id);
      return exists ? prev.filter((u) => u.id !== user.id) : [...prev, user];
    });
  };
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, selectedUser]);
  const getPreviewUrl = (file: string | File) =>
    typeof file === "string" ? file : URL.createObjectURL(file);
  let timeout: NodeJS.Timeout;
  const handleFilesChange = (info: any) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      const images = info.fileList
        .map((file: any) => file.originFileObj)
        .filter(
          (file: File | undefined) => file && file.type.startsWith("image/")
        );
      if (!images.length) {
        toast.error("Vui lòng chọn ảnh");
        return;
      }
      console.log("Gọi 1 lần sau khi chọn xong:", images);
      const previewUrls = images.map((file: any) => getPreviewUrl(file));
      handleMessage({ files: previewUrls });
      const isMeSender = selectedUser.senderId === currentUser?.id;
      const payload = {
        receiverId: isMeSender
          ? selectedUser.receiverId
          : selectedUser.senderId,
        isGroup: selectedUser?.isGroup || false,
        content: "test",
        groupId: selectedUser?.groupId ? selectedUser?.groupId : null,
        files: images,
      };
      console.log("payload", payload);
      mutation.mutate(payload);
      setUploadKey((prev) => prev + 1);
    }, 100);
  };
  //console.log("messs", messages);
  const renderMessages = () => {
    if (!messages.length) {
      return <Text type="secondary">Không có nội dung</Text>;
    }
    const filteredMessages = messages.filter((msg: any) => {
      return msg?.conversationId === selectedUser?.conversationId;
    });
    if (!filteredMessages.length) {
      return <Text type="secondary">Không có nội dung</Text>;
    }
    return messages.map((msg: any, idx: number) => {
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
          {!isMe && (
            <Avatar src={msg?.senderInfo?.avatar} style={{ marginRight: 8 }} />
          )}
          <div
            style={{
              maxWidth: "80%",
            }}
          >
            {msg.isGroup && !isMe && <div>{msg?.senderInfo?.fullName}</div>}
            {msg.content && (
              <>
                <div
                  style={{
                    padding: 10,
                    marginBottom: 10,
                    borderRadius: 8,
                    background: isMe ? "#d9f7be" : "#f0f0f0",
                  }}
                >
                  {msg.content}
                </div>
              </>
            )}
            <Space wrap style={{ display: "flex", gap: "10px" }}>
              {msg?.files?.map((file: string, index: number) => {
                return (
                  <div
                    key={index}
                    style={{
                      position: "relative",
                      borderRadius: 8,
                      overflow: "hidden",
                      border: "1px solid #f0f0f0",
                      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
                    }}
                  >
                    <Image src={file} width={120} height={120} />
                  </div>
                );
              })}
            </Space>
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
            {/* <Tooltip title="User">
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
            </Tooltip> */}
          </div>

          {/* Tabs and List */}
          <Tabs activeKey={activeKey} onChange={setActiveKey} size="small">
            <Tabs.TabPane tab="Tin nhắn" key="1">
              <List
                dataSource={conversations}
                renderItem={(item) => (
                  <List.Item
                    onClick={() => handleDetail(item)}
                    style={{
                      paddingLeft: 10,
                      cursor: "pointer",
                      background:
                        selectedUser?.conversationId === item.conversationId
                          ? "#f0f0f0"
                          : undefined,
                    }}
                  >
                    <List.Item.Meta
                      style={{ paddingRight: 10 }}
                      avatar={
                        item.isGroup ? (
                          <Avatar icon={<UserOutlined />} />
                        ) : (
                          <Avatar
                            src={
                              currentUser.id === item.senderId
                                ? item.receiverInfo?.avatar
                                : item.senderInfo?.avatar
                            }
                          >
                            {(currentUser.id === item.senderId
                              ? item.receiverInfo?.fullName
                              : item.senderInfo?.fullName
                            )?.charAt(0)}
                          </Avatar>
                        )
                      }
                      title={
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Badge
                            count={
                              item.unreadCount > 0 &&
                              item.conversationId !==
                                selectedUser?.conversationId
                                ? item.unreadCount
                                : 0
                            }
                            offset={[8, 0]}
                          >
                            {item.isGroup ? (
                              <>
                                <span>{item.groupName}</span>
                              </>
                            ) : (
                              <>
                                <span>
                                  {currentUser.id === item.senderId
                                    ? item?.receiverInfo?.fullName
                                    : item?.senderInfo?.fullName}
                                </span>
                              </>
                            )}
                          </Badge>
                          <span style={{ fontSize: 12, color: "#888" }}>
                            {dayjs(item.created).format("DD/MM/YYYY")}
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
                          {item.content}
                        </span>
                      }
                    />
                  </List.Item>
                )}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab={"Danh bạ"} key="2">
              <List
                dataSource={users?.filter(
                  (user: any) => user.id !== currentUser.id
                )}
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
                        <Avatar src={user.avatar}>
                          {user.fullName?.charAt(0)}
                        </Avatar>
                      }
                      title={user.fullName}
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
                {selectedUser.isGroup ? (
                  <>
                    {selectedUser.groupName || "Nhóm không tên"}
                    {selectedUser.userIds?.length ? (
                      <span
                        style={{
                          fontWeight: "normal",
                          marginLeft: 8,
                          fontSize: 14,
                        }}
                      >
                        ({selectedUser.userIds.length} thành viên)
                      </span>
                    ) : null}
                  </>
                ) : (
                  // Nếu là trò chuyện cá nhân
                  <>
                    {selectedUser.senderId === currentUser.id
                      ? selectedUser.receiverInfo?.fullName
                      : selectedUser.senderInfo?.fullName}
                  </>
                )}
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
            {selectedUser && (
              <>
                <div>
                  <Upload
                    key={uploadKey}
                    name="avatar"
                    showUploadList={false}
                    multiple
                    beforeUpload={() => false}
                    onChange={handleFilesChange}
                    accept="image/png, image/jpeg, image/gif"
                  >
                    <PictureOutlined style={{ fontSize: 20 }} />
                  </Upload>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "flex-end",
                    marginTop: 5,
                  }}
                >
                  <Input.TextArea
                    placeholder={"Enter message"}
                    autoSize={{ minRows: 3, maxRows: 8 }}
                    value={messageInput}
                    onChange={(e) => {
                      setMessageInput(e.target.value);
                      handleInputChange(e.target.value);
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
              </>
            )}
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
          dataSource={users?.filter((user: any) => user.id !== currentUser.id)}
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
          dataSource={users}
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
