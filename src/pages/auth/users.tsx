/* eslint-disable @typescript-eslint/no-explicit-any */
import useElementHeight from "../../utils/useElementHeight";
import { useRef, useState } from "react";
import { Row, Card } from "antd";
import DataTable from "../../components/common/DataTable";
import * as utils from "../../utils/filter/users";
import FilterData from "../../components/common/FilterData";
import { AuthApi } from "../../apis/auth/auth";
import queryString from "query-string";
const Users = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const heightElement = useElementHeight(divRef);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [totalRows, setTotalRows] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [filteredColumns, setFilteredColumns] = useState(utils.columns);

  const fetchUsers = async (params: Record<string, string>) => {
    try {
      const response: any = await AuthApi.getWithPagination(
        queryString.stringify(params)
      );
      setDataSource(response.data.items);
      setTotalRows(response?.data.totalCount || 0);
    } catch (error) {
      console.error("Lỗi khi tải danh sách người dùng:", error);
    }
  };
  const handleActions = {
    createNew: () => {
      console.log("Tạo mới người dùng");
    },
    deleteUser: () => {
      console.log("Xóa người dùng");
    },
    exportData: () => {
      console.log("Xuất dữ liệu");
    },
  };
  return (
    <Card className="ant-custom-pagination">
      <div ref={divRef}>
        <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
          <FilterData
            onColumnChange={setFilteredColumns}
            onFilterChange={fetchUsers}
            handlers={handleActions}
            utils={utils}
          />
        </Row>
      </div>
      <DataTable
        current={pageNumber}
        columns={filteredColumns}
        dataSource={dataSource}
        total={totalRows}
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
