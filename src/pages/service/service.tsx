import { Row, Card } from "antd";
import useElementHeight from "../../utils/useElementHeight";
import { useMemo, useRef, useState } from "react";
import FilterData from "../../components/common/FilterData";
import * as utils from "../../utils/filter/services";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { checkAccessRight } from "../../utils/common/accessUtils";
import { useSelector } from "react-redux";
import DataTable from "../../components/common/DataTable";
import { useQuery, useMutation } from "@tanstack/react-query";
import queryString from "query-string";
import ModalConfirm from "../../components/ModalConfirm";
import { toast } from "react-toastify";
import { ServiceApi } from "../../apis/catalog/service";

const Services = () => {
  const accesses = useSelector((state: any) => state.auth.user?.accesses);
  const divRef = useRef<HTMLDivElement>(null);
  const heightElement = useElementHeight(divRef);
  const [filteredColumns, setFilteredColumns] = useState();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [rowId, setRowId] = useState<number>(0);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const handleFilterChange = (params: Record<string, string>) => {
    setFilters(params);
    setPageNumber(1);
  };
  const handleActions = {
    createNew: () => {
      navigate("/service/none");
    },
  };
  const handleItemTable = {
    handleEdit: (record: any) => {
      navigate(`/service/${record.id}`);
    },
    handleDelete: (record: any) => {
      setRowId(record.id);
      setOpenModal(true);
    },
  };
  const { data, refetch } = useQuery({
    queryKey: ["serviceList", { pageNumber, pageSize, ...filters }],
    queryFn: async () => {
      const response: any = await ServiceApi.getWithPagination(
        queryString.stringify({ pageNumber, pageSize, ...filters }),
      );
      return response.data;
    },
    enabled: !!filters,
  });
  const mutationDelete = useMutation({
    mutationFn: async (id: number) => {
      return ServiceApi.delete(id);
    },
    onSuccess: (res: any) => {
      if (res.succeeded) {
        refetch();
        toast.success(t("Delete successfully!"));
      } else {
        toast.error(t(res.message));
      }
      setRowId(0);
      setOpenModal(false);
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
      hasEditPermission: checkAccessRight(accesses, "update", "service"),
      hasDeletePermission: checkAccessRight(accesses, "delete", "service"),
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
            onColumnChange={setFilteredColumns}
            onFilterChange={handleFilterChange}
            handlers={handleActions}
            utils={utils}
            filteredColumns={columns}
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
      />
      <ModalConfirm
        openModal={openModal}
        setOpenModal={setOpenModal}
        onChange={() => confirmDelete(rowId)}
      />
    </Card>
  );
};

export default Services;
