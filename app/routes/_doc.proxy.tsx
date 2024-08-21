import { LoaderFunctionArgs, json } from "@remix-run/node";
import { MetaFunction, useLoaderData } from "@remix-run/react";
import hub from "../core";
import { Button, Space, Switch, Table } from "antd";

export const meta: MetaFunction = () => {
  return [{ title: "LiteProxy" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const searchParams = new URL(request.url).searchParams;
  const pageNum = Number(searchParams.get('pageNum') ?? 1);
  const pageSize = Number(searchParams.get('pageSize') ?? 10);
  return hub.Query(pageNum, pageSize);
}

export default
function DocProxy() {
  const page = useLoaderData<typeof loader>();

  return <div className="p-4">
    <div>
      <Table
        bordered
        size="small"
        columns={[
          {
            title: '端口',
            dataIndex: 'port',
            width: 100,
          },
          {
            title: '名称',
            dataIndex: 'name',
          },
          {
            title: '状态',
            dataIndex: 'enabled',
            width: 120,
            render: (value, record) => {
              return <Space>
                <Switch size="small" />
                <span>启用</span>
              </Space>;
            },
          },
          {
            title: '操作',
            width: 120,
            render: (record) => {
              return <Space>
                <Button size="small" type="link" className="p-0">编辑</Button>
                <Button size="small" type="link" danger className="p-0">删除</Button>
              </Space>;
            },
          },
        ]}
        dataSource={page.list}
        pagination={{
          size: 'default',
        }}
      />
    </div>
  </div>;
}
