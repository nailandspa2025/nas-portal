import useElementHeight from "../../utils/useElementHeight";
import { useRef, useState } from "react";
import { Row, Card } from "antd";
import DataTable from "../../components/common/DataTable";
import * as utils from "../../utils/filter/users";
import FilterData from "../../components/common/FilterData";
const Users = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const heightElement = useElementHeight(divRef);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [filteredColumns, setFilteredColumns] = useState(utils.columns);

  const dataSource = [
    {
      id: 1,
      key: "1",
      name: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      phone: "0123 456 789",
      status: "Active",
    },
    {
      id: 2,
      key: "2",
      name: "Trần Thị B",
      email: "tranthib@example.com",
      phone: "0987 654 321",
      status: "Inactive",
    },
    {
      id: 3,
      key: "3",
      name: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      phone: "0123 456 789",
      status: "Active",
    },
    {
      id: 4,
      key: "4",
      name: "Trần Thị B",
      email: "tranthib@example.com",
      phone: "0987 654 321",
      status: "Inactive",
    },
  ];
  const fetchUsers = async (params: Record<string, string>) => {
    try {
      console.log("params", params);
      // const response = await axios.get("/api/users", { params });
      // setUsers(response.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách người dùng:", error);
    }
  };
  const handleActions = {
    createNew: () => {
      console.log("Tạo mới người dùng");
      // Logic mở modal hoặc gọi API tạo mới
    },
    deleteUser: () => {
      console.log("Xóa người dùng");
      // Logic xóa user
    },
    exportData: () => {
      console.log("Xuất dữ liệu");
      // Logic xuất file CSV/Excel
    },
  };
  return (
    <Card className="ant-custom-pagination">
      <div ref={divRef}>
        <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
          <FilterData
            filters={utils.filters}
            columns={filteredColumns}
            onColumnChange={setFilteredColumns}
            onFilterChange={fetchUsers}
            buttons={utils.buttons}
            actions={utils.actions}
            handlers={handleActions}
          />
        </Row>
      </div>
      <DataTable
        current={pageNumber}
        columns={filteredColumns}
        dataSource={dataSource}
        total={4}
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
