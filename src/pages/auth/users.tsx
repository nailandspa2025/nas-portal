import useElementHeight from "../../utils/useElementHeight";
import { useRef, useState } from "react";
import { Row, Card } from "antd";
//import SearchText from "../../components/common/SearchText";
import DataTable from "../../components/common/DataTable";
import * as utils from "../../utils/filter/users";
import FilterData from "../../components/common/FilterData";
import { TypeFilter } from "../../utils/common/typeFilter";
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

  console.log(pageNumber, keywordSearch);

  const fetchUsers = async (appliedFilters: TypeFilter[]) => {
    const params = appliedFilters.reduce((acc, filter) => {
      if (filter.field !== undefined) {
        acc[filter.field] = filter.value;
      }
      return acc;
    }, {} as Record<string, unknown>);

    try {
      console.log("canhlv", params);
      // const response = await axios.get("/api/users", { params });
      // setUsers(response.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách người dùng:", error);
    }
  };
  return (
    <Card className="ant-custom-pagination">
      <div ref={divRef}>
        <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
          <FilterData
            value={strSearch}
            placeholder="Nhập từ khoá tìm...."
            onChange={handleSearch}
            submit={() => {
              setKeywordSearch(strSearch);
            }}
            filters={utils.filters}
            onFilterChange={fetchUsers}
          />
        </Row>
      </div>
      <DataTable
        columns={utils.columns}
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
