/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Row } from "antd";
import { useMemo, useRef, useState } from "react";
import FilterData from "../../components/common/FilterData";
import * as utils from "../../utils/filter/rewards";
import { useSelector } from "react-redux";
import { checkAccessRight } from "../../utils/common/accessUtils";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import useElementHeight from "../../utils/useElementHeight";
import DataTable from "../../components/common/DataTable";
import { useMutation, useQuery } from "@tanstack/react-query";
import { RewardApi } from "../../apis/catalog/reward";
import queryString from "query-string";
import { toast } from "react-toastify";
import ModalConfirm from "../../components/ModalConfirm";
const Rewards = () => {
  const accesses = useSelector((state: any) => state.auth.user?.accesses);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const divRef = useRef<HTMLDivElement>(null);
  const heightElement = useElementHeight(divRef);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [filteredColumns, setFilteredColumns] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [rowId, setRowId] = useState<number>(0);
  const handleFilterChange = (params: Record<string, string>) => {
    setFilters(params);
    setPageNumber(1);
  };
  const { data, refetch } = useQuery({
    queryKey: ["rewardList", { pageNumber, pageSize, ...filters }],
    queryFn: async () => {
      const response: any = await RewardApi.getWithPagination(
        queryString.stringify({ pageNumber, pageSize, ...filters })
      );
      return response.data;
    },
    enabled: !!filters,
  });
  const handleActions = {
    createNew: () => {
      navigate("/reward/none");
    },
  };
  const handleItemTable = {
    handleEdit: (record: any) => {
      navigate(`/reward/${record.id}`);
    },
    handleDelete: (record: any) => {
      setRowId(record.id);
      setOpenModal(true);
    },
  };
  const columns = useMemo(() => {
    return utils.columns({
      hasEditPermission: checkAccessRight(accesses, "update", "reward"),
      hasDeletePermission: checkAccessRight(accesses, "delete", "reward"),
      t,
      handleEdit: handleItemTable.handleEdit,
      handleDelete: handleItemTable.handleDelete,
    });
  }, [accesses, t]);
  const mutationDelete = useMutation({
    mutationFn: async (id: number) => {
      return RewardApi.delete(id);
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
      />
      <ModalConfirm
        openModal={openModal}
        setOpenModal={setOpenModal}
        onChange={() => confirmDelete(rowId)}
      />
    </Card>
  );
};

export default Rewards;
