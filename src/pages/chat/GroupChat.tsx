/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, Button, Checkbox, Input, List, Modal, Typography } from "antd";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DropdownApi } from "../../apis/dropdown/dropdown";
import queryString from "query-string";
import { toast } from "react-toastify";
import { connection, startConnection } from "../../utils/signalr";
import { useSelector } from "react-redux";

const { TextArea } = Input;
const { Title } = Typography;

const ChatGroup = () => {
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [searchText, setSearchText] = useState<string>("");
  const [groupName, setGroupName] = useState("");
  const [groupMembers, setGroupMembers] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [currentGroupId, setCurrentGroupId] = useState<string | null>(null);
  const user = useSelector((state: any) => state.auth.user);

  const { data: users } = useQuery({
    queryKey: ["userOption", searchText],
    queryFn: () =>
      DropdownApi.getUsers(
        queryString.stringify({ page: 1, pageSize: 20, searchText })
      ),
  });

  const handleToggleGroupUser = (user: any) => {
    if (groupMembers.some((u) => u.id === user.id)) {
      setGroupMembers(groupMembers.filter((u) => u.id !== user.id));
    } else {
      setGroupMembers([...groupMembers, user]);
    }
  };

  const handleCreateGroup = async () => {
    if (groupMembers.length < 2) {
      toast.warning("Chọn ít nhất 2 người để tạo nhóm");
      return;
    }

    const groupId = `group-${Date.now()}`;
    setCurrentGroupId(groupId);

    await startConnection();
    await connection.invoke("JoinGroup", groupId);

    toast.success("Tạo nhóm thành công!");
    setShowGroupModal(false);
    setGroupName("");
    setGroupMembers([]);
  };

  const handleSendMessage = async () => {
    if (!message || !currentGroupId) return;

    await startConnection();

    const msg = {
      senderId: user.id,
      fullName: user.fullName,
      content: message,
      groupId: currentGroupId,
      isGroup: true,
      timestamp: new Date(),
    };

    await connection.invoke("SendMessage", msg);
    setMessage("");
  };

  // Tự động join group nếu currentGroupId thay đổi
  useEffect(() => {
    const joinGroupIfNeeded = async () => {
      if (!currentGroupId) return;

      await startConnection();
      await connection.invoke("JoinGroup", currentGroupId);
    };

    joinGroupIfNeeded();
  }, [currentGroupId]);

  // Lắng nghe tin nhắn mới
  useEffect(() => {
    const handleReceiveMessage = (msg: any) => {
      if (msg.groupId === currentGroupId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    connection.on("ReceiveMessage", handleReceiveMessage);

    return () => {
      connection.off("ReceiveMessage", handleReceiveMessage);
    };
  }, [currentGroupId]);

  return (
    <>
      <Button onClick={() => setShowGroupModal(true)}>Tạo nhóm</Button>

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
                style={{ paddingRight: 10 }}
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

      {/* Giao diện chat nhóm */}
      {currentGroupId && (
        <div style={{ marginTop: 20 }}>
          <Title level={5}>Nhóm: {groupName || currentGroupId}</Title>
          <List
            dataSource={messages}
            renderItem={(msg: any) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar>{msg.fullName?.[0]}</Avatar>}
                  title={msg.fullName}
                  description={msg.content}
                />
              </List.Item>
            )}
            style={{ maxHeight: 300, overflowY: "auto" }}
          />
          <TextArea
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onPressEnter={(e) => {
              if (!e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Nhập tin nhắn..."
            style={{ marginTop: 10 }}
          />
          <Button
            type="primary"
            onClick={handleSendMessage}
            style={{ marginTop: 10 }}
          >
            Gửi
          </Button>
        </div>
      )}
    </>
  );
};

export default ChatGroup;
