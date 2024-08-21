import { LoaderFunctionArgs, json } from "@remix-run/node";
import { MetaFunction, useLoaderData } from "@remix-run/react";
import hub from "../core";
import { Button, Modal, Space, Switch, Table } from "antd";

export const meta: MetaFunction = () => {
  return [{ title: "LiteProxy" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const searchParams = new URL(request.url).searchParams;
  const pageNum = Number(searchParams.get('pageNum') ?? 1);
  const pageSize = Number(searchParams.get('pageSize') ?? 10);
  return json(await hub.Query(pageNum, pageSize));
}

export default
function DocProxy() {
  const page = useLoaderData<typeof loader>();

  return <div className="p-4">
    <div className="flex justify-between">
      <span></span>
      <Button>新增代理</Button>
    </div>
    <div className="mt-2">
      <Table
        rowKey="port"
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
                <Switch size="small" checked={value} />
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
                <Button size="small" type="link" danger className="p-0" onClick={() => {
                  Modal.confirm({
                    title: '系统提示',
                    content: <div>
                      <div>确认删除此代理服务？</div>
                      <div className="mt-1 px-2 py-1 bg-gray-200">1123</div>
                    </div>,
                    onOk: () => {

                    },
                  });
                }}>删除</Button>
              </Space>;
            },
          },
        ]}
        dataSource={page.list}
        pagination={{
          size: 'default',
          total: page.total,
          current: page.pageNum,
          pageSize: page.pageSize,
        }}
      />
    </div>
  </div>;
}
