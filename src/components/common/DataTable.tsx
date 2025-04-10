/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table, Empty, TableProps } from "antd";
import { useTranslation } from "react-i18next";
import useIsMobile from "../../utils/useIsMobile";
interface DataTableProps<T> {
  dataSource?: T[];
  columns?: any;
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
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  return (
    <Table<T>
      columns={columns.filter((col: any) => !col.hidden)}
      dataSource={dataSource}
      tableLayout="fixed"
      rowKey="id"
      scroll={{
        y: !isMobile ? `calc(65vh - ${heightTable}px)` : "100%",
        x: "max-content",
      }}
      locale={{
        emptyText: <Empty description={<span>{t("No data")}</span>} />,
      }}
      pagination={{
        defaultCurrent: current,
        showSizeChanger: true,
        locale: { items_per_page: t("/ pages") },

        pageSize: pageSize,
        total: total,
        showTotal: (total) => `${t("Total")} ${total}`,
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
