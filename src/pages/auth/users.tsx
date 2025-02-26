import useElementHeight from "../../utils/useElementHeight";
import { useRef, useState } from "react";
import { Row, Card } from "antd";
import SearchText from "../../components/common/SearchText";
import DataTable from "../../components/common/DataTable";
const Users = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const heightElement = useElementHeight(divRef);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [strSearch, setStrSearch] = useState<string>("");
  const [keywordSearch, setKeywordSearch] = useState<string>("");
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStrSearch(event.target.value);
  };
  const dataSource = [
    {
      key: "1",
      name: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      phone: "0123 456 789",
      status: "Active",
    },
    {
      key: "2",
      name: "Trần Thị B",
      email: "tranthib@example.com",
      phone: "0987 654 321",
      status: "Inactive",
    },
    {
      key: "2",
      name: "Trần Thị B",
      email: "tranthib@example.com",
      phone: "0987 654 321",
      status: "Inactive",
    },
    {
      key: "2",
      name: "Trần Thị B",
      email: "tranthib@example.com",
      phone: "0987 654 321",
      status: "Inactive",
    },
    {
      key: "2",
      name: "Trần Thị B",
      email: "tranthib@example.com",
      phone: "0987 654 321",
      status: "Inactive",
    },
    {
      key: "2",
      name: "Trần Thị B",
      email: "tranthib@example.com",
      phone: "0987 654 321",
      status: "Inactive",
    },

    {
      key: "2",
      name: "Trần Thị B",
      email: "tranthib@example.com",
      phone: "0987 654 321",
      status: "Inactive",
    },
    {
      key: "2",
      name: "Trần Thị B",
      email: "tranthib@example.com",
      phone: "0987 654 321",
      status: "Inactive",
    },
    {
      key: "2",
      name: "Trần Thị B",
      email: "tranthib@example.com",
      phone: "0987 654 321",
      status: "Inactive",
    },
    {
      key: "1",
      name: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      phone: "0123 456 789",
      status: "Active",
    },
    {
      key: "2",
      name: "Trần Thị B",
      email: "tranthib@example.com",
      phone: "0987 654 321",
      status: "Inactive",
    },
    {
      key: "2",
      name: "Trần Thị B",
      email: "tranthib@example.com",
      phone: "0987 654 321",
      status: "Inactive",
    },
    {
      key: "2",
      name: "Trần Thị B",
      email: "tranthib@example.com",
      phone: "0987 654 321",
      status: "Inactive",
    },
    {
      key: "2",
      name: "Trần Thị B",
      email: "tranthib@example.com",
      phone: "0987 654 321",
      status: "Inactive",
    },
    {
      key: "2",
      name: "Trần Thị B",
      email: "tranthib@example.com",
      phone: "0987 654 321",
      status: "Inactive",
    },

    {
      key: "2",
      name: "Trần Thị B",
      email: "tranthib@example.com",
      phone: "0987 654 321",
      status: "Inactive",
    },
    {
      key: "2",
      name: "Trần Thị B",
      email: "tranthib@example.com",
      phone: "0987 654 321",
      status: "Inactive",
    },
    {
      key: "2",
      name: "Trần Thị B",
      email: "tranthib@example.com",
      phone: "0987 654 321",
      status: "Inactive",
    },
    {
      key: "1",
      name: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      phone: "0123 456 789",
      status: "Active",
    },
    {
      key: "2",
      name: "Trần Thị B",
      email: "tranthib@example.com",
      phone: "0987 654 321",
      status: "Inactive",
    },
    {
      key: "2",
      name: "Trần Thị B",
      email: "tranthib@example.com",
      phone: "0987 654 321",
      status: "Inactive",
    },
    {
      key: "2",
      name: "Trần Thị B",
      email: "tranthib@example.com",
      phone: "0987 654 321",
      status: "Inactive",
    },
    {
      key: "2",
      name: "Trần Thị B",
      email: "tranthib@example.com",
      phone: "0987 654 321",
      status: "Inactive",
    },
    {
      key: "2",
      name: "Trần Thị B",
      email: "tranthib@example.com",
      phone: "0987 654 321",
      status: "Inactive",
    },

    {
      key: "2",
      name: "Trần Thị B",
      email: "tranthib@example.com",
      phone: "0987 654 321",
      status: "Inactive",
    },
    {
      key: "2",
      name: "Trần Thị B",
      email: "tranthib@example.com",
      phone: "0987 654 321",
      status: "Inactive",
    },
    {
      key: "2",
      name: "Trần Thị B",
      email: "tranthib@example.com",
      phone: "0987 654 321",
      status: "Inactive",
    },
  ];

  // Cấu hình cột của bảng
  const columns = [
    {
      title: "Họ và Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text: string) => (
        <span style={{ color: text === "Active" ? "green" : "red" }}>
          {text}
        </span>
      ),
    },
  ];
  console.log(pageNumber, keywordSearch);
  return (
    <Card className="ant-custom-pagination">
      <div ref={divRef}>
        <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
          <SearchText
            value={strSearch}
            placeholder="Nhập từ khoá tìm...."
            onChange={handleSearch}
            submit={() => {
              setKeywordSearch(strSearch);
            }}
          />
        </Row>
      </div>
      <DataTable
        columns={columns}
        dataSource={dataSource}
        total={50}
        pageSize={pageSize}
        heightTable={heightElement}
        onChange={(page, pageSize) => {
          setPageSize(pageSize);
          setPageNumber(page);
        }}
      />
    </Card>
  );
};

export default Users;
