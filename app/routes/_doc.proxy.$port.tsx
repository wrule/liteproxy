import { LoaderFunctionArgs } from "@remix-run/node";
import { json, MetaFunction, useLoaderData } from "@remix-run/react";
import { Button, Col, Form, Input, InputNumber, Row, Space, Switch } from "antd";
import hub from "~/core";

export const meta: MetaFunction = () => {
  return [{ title: "DEMO About" }];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const port = (params.port as string).toLowerCase();
  if (port !== 'create') return json(await hub.Find(Number(port)));
  return json(null);
}

export default
function DocProxyDetail() {
  const config = useLoaderData<typeof loader>();
  const [form] = Form.useForm();

  return <div className="p-4">
    <Form
      method="POST"
      action="/api/proxy">
      {/* <Row gutter={15}>
        <Col span={6}>
          <Form.Item label="端口" name="port" initialValue={config?.port}>
            <InputNumber
              name="port"
              readOnly={!!config?.port}
              className="w-full"
              placeholder="请输入端口"
            />
          </Form.Item>
        </Col>
        <Col span={18}>
          <Form.Item label="启用" name="enabled" initialValue={config?.enabled}>
            <Switch />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item label="名称" name="name" initialValue={config?.name}>
        <Input
          name="name"
          className="w-full"
          placeholder="请输入名称"
        />
      </Form.Item>
      <Form.Item label="配置" name="configCode" initialValue={config?.configCode}>
        <Input.TextArea
          name="configCode"
          placeholder="请输入配置代码"
          autoSize={{ minRows: 12 }}
        />
      </Form.Item> */}
      <Form.Item>
        <div className="w-full flex justify-between">
          <span></span>
          <Button type="primary" htmlType="submit">保存</Button>
        </div>
      </Form.Item>
    </Form>
  </div>;
}
