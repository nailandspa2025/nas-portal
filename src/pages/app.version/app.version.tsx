/* eslint-disable @typescript-eslint/no-explicit-any */
import useElementHeight from "../../utils/useElementHeight";
import { useMemo, useRef, useState } from "react";
import { Row, Card } from "antd";
import DataTable from "../../components/common/DataTable";
import * as utils from "../../utils/filter/app.versions";
import FilterData from "../../components/common/FilterData";
import queryString from "query-string";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { checkAccessRight } from "../../utils/common/accessUtils";
import { useTranslation } from "react-i18next";
import { buildFormData } from "../../utils/common/buildFormData";
import { AppVersionApi } from "../../apis/auth/appVersion";
import ModalFormAppVersion from "./ModalFormAppVersion";

const toFormData = (values: any) => {
  const formD = new FormData();
  buildFormData(formD, values);
  return formD;
};

const AppVersions = () => {
  const accesses = useSelector((state: any) => state.auth.user?.accesses);
  const { t } = useTranslation();

  const divRef = useRef<HTMLDivElement>(null);
  const heightElement = useElementHeight(divRef);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [filteredColumns, setFilteredColumns] = useState();
  const [openModalForm, setOpenModalForm] = useState<boolean>(false);
  const [dataDetail, setDataDetail] = useState<any>({});
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const { data, refetch } = useQuery({
    queryKey: ["appVersionList", { pageNumber, pageSize, ...filters }],
    queryFn: async () => {
      const response: any = await AppVersionApi.getWithPagination(
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

  const mutationForm = useMutation({
    mutationFn: async (values: any) => {
      return values.id
        ? await AppVersionApi.update(values.id, toFormData(values))
        : await AppVersionApi.create(toFormData(values));
    },
    onSuccess: (res: any) => {
      if (res.succeeded) {
        toast.success(t("Save successfully"));
        refetch();
        setOpenModalForm(false);
      } else toast.error(t(res.message));
    },
    onError: () => {
      toast.error(t("An error occurred"));
    },
  });

  const mutationToggle = useMutation({
    mutationFn: async (values: any) =>
      AppVersionApi.update(values.id, toFormData(values)),
    onMutate: (values: any) => setTogglingId(values.id),
    onSuccess: (res: any) => {
      if (res.succeeded) {
        toast.success(t("Save successfully"));
        refetch();
      } else toast.error(t(res.message));
    },
    onError: () => {
      toast.error(t("An error occurred"));
    },
    onSettled: () => setTogglingId(null),
  });

  const handleActions = {
    createNew: () => {
      setDataDetail({});
      setOpenModalForm(true);
    },
  };

  const columns = useMemo(() => {
    return utils.columns({
      hasEditPermission: checkAccessRight(accesses, "update", "app-version"),
      t,
      togglingId,
      handleEdit: (record: any) => {
        setDataDetail(record);
        setOpenModalForm(true);
      },
      // UpdateAppVersionCommand overwrites every field, so send the whole record.
      handleToggleRequired: (record: any, checked: boolean) => {
        mutationToggle.mutate({
          id: record.id,
          name: record.name,
          platform: record.platform,
          version: record.version,
          isRequired: checked,
        });
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accesses, t, togglingId]);

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
      <ModalFormAppVersion
        title={dataDetail?.id ? "Update app version" : "Create app version"}
        openModal={openModalForm}
        setOpenModal={setOpenModalForm}
        onSubmit={(values) => mutationForm.mutate(values)}
        loading={mutationForm.isPending}
        data={dataDetail}
      />
    </Card>
  );
};

export default AppVersions;
