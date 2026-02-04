/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Row } from "antd";
import { useQuery, useMutation } from "@tanstack/react-query";
import queryString from "query-string";
import * as utils from "../../utils/filter/reminder";
import FilterData from "../../components/common/FilterData";
import DataTable from "../../components/common/DataTable";
import useElementHeight from "../../utils/useElementHeight";
import { useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ModalConfirm from "../../components/ModalConfirm";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { checkAccessRight } from "../../utils/common/accessUtils";
import { ReminderApi } from "../../apis/order/reminder";

const ConfigReminder = () => {
  const accesses = useSelector((state: any) => state.auth.user?.accesses);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const divRef = useRef<HTMLDivElement>(null);
  const heightElement = useElementHeight(divRef);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [rowId, setRowId] = useState<number>(0);
  const [filteredColumns, setFilteredColumns] = useState();

  const { data, refetch } = useQuery({
    queryKey: ["bioList", { pageNumber, pageSize, ...filters }],
    queryFn: async () => {
      const response: any = await ReminderApi.getWithPagination(
        queryString.stringify({ pageNumber, pageSize, ...filters })
      );
      return response.data;
    },
    enabled: !!filters,
  });
  const handleFilterChange = (params: Record<string, string>) => {
    setFilters(params);
    setPageNumber(1);
  };
  const handleActions = {
    createNew: () => {
      navigate("/config-reminder/none");
    },
  };
  const handleItemTable = {
    handleEdit: (record: any) => {
      navigate(`/config-reminder/${record.id}`);
    },
    handleDelete: (record: any) => {
      setRowId(record.id);
      setOpenModal(true);
    },
  };
  const mutationDelete = useMutation({
    mutationFn: async (id: number) => {
      return ReminderApi.delete(id);
    },
    onSuccess: (res: any) => {
      setRowId(0);
      setOpenModal(false);
      if (res.succeeded) {
        refetch();
        toast.success(t("Delete successfully!"));
      } else {
        toast.error(t(res.message));
      }
    },
    onError: (error) => {
      setRowId(0);
      setOpenModal(false);
      toast.error(t(error.message));
    },
  });
  const confirmDelete = (id: number) => {
    mutationDelete.mutate(id);
  };
  const columns = useMemo(() => {
    return utils.columns({
      hasEditPermission: checkAccessRight(
        accesses,
        "update",
        "config-reminder"
      ),
      hasDeletePermission: checkAccessRight(
        accesses,
        "delete",
        "config-reminder"
      ),
      t,
      handleEdit: handleItemTable.handleEdit,
      handleDelete: handleItemTable.handleDelete,
    });
  }, [accesses, t]);
  return (
    <Card className="ant-custom-pagination">
      <div ref={divRef}>
        <Row style={{ marginBottom: "16px" }}>
          <FilterData
            filteredColumns={columns}
            onColumnChange={setFilteredColumns}
            onFilterChange={handleFilterChange}
            handlers={handleActions}
            utils={utils}
          />
        </Row>
      </div>
      <DataTable
        current={pageNumber}
        columns={filteredColumns}
        dataSource={data?.items}
        total={data?.totalCount}
        pageSize={pageSize}
        heightTable={heightElement}
        onChange={(page, pageSize) => {
          setPageSize(pageSize);
          setPageNumber(page);
        }}
        expandable={{
          defaultExpandAllRows: true,
          childrenColumnName: "children",
        }}
      />
      <ModalConfirm
        openModal={openModal}
        setOpenModal={setOpenModal}
        onChange={() => confirmDelete(rowId)}
      />
    </Card>
  );
};

export default ConfigReminder;
