import { MetaFunction, Outlet } from "@remix-run/react";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import "dayjs/locale/zh-cn";
import Content from "~/components/Content";
import Header from "~/components/Header";
import Menu from "~/components/Menu";
import Sider from "~/components/Sider";

export const meta: MetaFunction = () => {
  return [{ title: "DEMO Page" }];
};

export default
function Doc() {
  return <ConfigProvider locale={zhCN} theme={{
    token: {
      colorPrimary: '#fdcd12',
      borderRadius: 2,
    },
  }}>
    <Header />
    <Sider>
      <Menu items={[{ name: '代理', path: '/proxy' }]} />
    </Sider>
    <Content>
      <Outlet />
    </Content>
  </ConfigProvider>;
}
