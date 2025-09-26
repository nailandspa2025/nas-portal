import { Layout, Menu, Grid } from "antd";
import {
  SettingOutlined,
  StarOutlined,
  ArrowUpOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ProgramApi } from "../../../apis/loyalty/program";
import GeneralInfoAction from "./GeneralInfoAction";
import RankingGeneral from "./RankingGeneral";
import UpgradeGeneral from "./UpgradeGeneral";
import EarningGeneral from "./EarningGeneral";
const LoyaltyProgramActions = () => {
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const isMobile = !screens.lg;

  const [selectedKey, setSelectedKey] = useState("program");
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [programId, setProgramId] = useState<number | undefined>();
  const { t } = useTranslation();
  const params = useParams();
  const { data, refetch } = useQuery({
    queryKey: ["programDetail", params.id],
    queryFn: async () => {
      const res: any = await ProgramApi.getById(params.id as any);
      setProgramId(res?.data?.id);
      return res?.data || {};
    },
    enabled: !!params.id,
  });
  const handleProgramSaved = (id: any) => {
    refetch();
    setIsSaved(true);
    setProgramId(id);
    setOpenKeys(["rankGroup"]);
    setSelectedKey("rank");
  };
  const handleMenuClick = ({ key }: { key: string }) => {
    setSelectedKey(key);
    //setOpenKeys([]);
  };
  return (
    <Layout style={{ height: "calc(100vh - 150px)" }}>
      {!isMobile ? (
        <Layout.Sider
          width={220}
          style={{ background: "#fff", borderRight: "1px solid #f0f0f0" }}
        >
          <div
            style={{ padding: "16px", fontWeight: "bold", fontSize: "14px" }}
          >
            LOYALTY
          </div>
          <Menu
            mode="inline"
            openKeys={openKeys}
            onOpenChange={setOpenKeys}
            selectedKeys={[selectedKey]}
            style={{ borderRight: 0 }}
            onClick={handleMenuClick}
          >
            <Menu.Item key="program" icon={<SettingOutlined />}>
              {t("Program configuration")}
            </Menu.Item>
            <Menu.SubMenu
              key="rankGroup"
              icon={<SettingOutlined />}
              title={t("Rank configuration")}
              disabled={!isSaved && !params.id}
            >
              <Menu.Item
                key="rank"
                icon={<StarOutlined />}
                disabled={!isSaved && !params.id}
              >
                {t("Create rank")}
              </Menu.Item>
              <Menu.Item
                key="upgrade"
                icon={<ArrowUpOutlined />}
                disabled={!isSaved && !params.id}
              >
                {t("Upgrade rank")}
              </Menu.Item>
            </Menu.SubMenu>
            <Menu.Item
              key="points"
              icon={<GiftOutlined />}
              disabled={!isSaved && !params.id}
            >
              {t("Points configuration")}
            </Menu.Item>
          </Menu>
        </Layout.Sider>
      ) : (
        // --- Mobile: Menu ngang ---
        <Menu
          mode="horizontal"
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
          style={{ borderBottom: "1px solid #f0f0f0", marginBottom: 16 }}
        >
          <Menu.Item key="program" icon={<SettingOutlined />}>
            {t("Program ")}
          </Menu.Item>
          <Menu.SubMenu
            key="rankGroup"
            icon={<SettingOutlined />}
            title={t("Rank")}
            disabled={!isSaved && !params.id}
          >
            <Menu.Item
              key="rank"
              icon={<StarOutlined />}
              disabled={!isSaved && !params.id}
            >
              {t("Create rank")}
            </Menu.Item>
            <Menu.Item
              key="upgrade"
              icon={<ArrowUpOutlined />}
              disabled={!isSaved && !params.id}
            >
              {t("Upgrade rank")}
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.Item
            key="points"
            icon={<GiftOutlined />}
            disabled={!isSaved && !params.id}
          >
            {t("Points")}
          </Menu.Item>
        </Menu>
      )}

      <Layout style={{ paddingLeft: isMobile ? 0 : 24 }}>
        {selectedKey === "program" && (
          <GeneralInfoAction item={data} onSaved={handleProgramSaved} />
        )}
        {selectedKey === "rank" && <RankingGeneral programId={programId} />}
        {selectedKey === "upgrade" && <UpgradeGeneral programId={programId} />}
        {selectedKey === "points" && <EarningGeneral programId={programId} />}
      </Layout>
    </Layout>
  );
};

export default LoyaltyProgramActions;
