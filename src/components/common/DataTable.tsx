import { Table, Empty, TableProps } from "antd";

interface DataTableProps<T> {
  dataSource?: T[];
  columns?: TableProps<T>["columns"];
  total?: number;
  pageSize?: number;
  onChange?: (page: number, pageSize: number) => void;
  pageSizeOptions?: string[];
  heightTable?: number;
  rowSelection?: TableProps<T>["rowSelection"] | null;
  bordered?: boolean;
  rowClassName?: boolean;
  current?: number;
}

const DataTable = <T extends Record<string, unknown>>({
  dataSource = [],
  columns = [],
  total = 0,
  pageSize = 10,
  onChange = () => {},
  pageSizeOptions = ["20", "30", "50", "100", "200", "500"],
  heightTable = 0,
  rowSelection = null,
  bordered = true,
  rowClassName = false,
  current = 1,
}: DataTableProps<T>) => {
  return (
    <Table<T>
      columns={columns.filter((col) => !col.hidden)}
      dataSource={dataSource}
      rowKey="id"
      scroll={{
        y: `calc(65vh - ${heightTable}px)`,
        x: "100%",
      }}
      locale={{
        emptyText: <Empty description={<span>Không có dữ liệu</span>} />,
      }}
      pagination={{
        defaultCurrent: current,
        showSizeChanger: true,
        locale: { items_per_page: "/ trang" },
        pageSize: pageSize,
        total: total,
        showTotal: (total) => `Tổng ${total}`,
        pageSizeOptions: pageSizeOptions,
        onChange: (page, pageSize) => onChange(page, pageSize),
      }}
      bordered={bordered}
      rowSelection={rowSelection || undefined}
      size="middle"
      rowClassName={(record) =>
        rowClassName ? (record.isActive ? "" : "table-row-disable") : ""
      }
    />
  );
};

export default DataTable;
