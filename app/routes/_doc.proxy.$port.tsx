import { LoaderFunctionArgs } from "@remix-run/node";
import { json, MetaFunction } from "@remix-run/react";
import { Button, Col, Form, Input, InputNumber, Row, Space, Switch } from "antd";
import hub from "~/core";

export const meta: MetaFunction = () => {
  return [{ title: "DEMO About" }];
};

export async function loader({ params }: LoaderFunctionArgs) {
  let result = { };
  const port = params.port;
  if (port && port.toLowerCase() !== 'new') {
  }
  return json(result);
}

export default
function DocProxyDetail() {
  return <div className="p-4">
    <Form
      layout="vertical">
      <Row gutter={15}>
        <Col span={6}>
          <Form.Item label="端口">
            <InputNumber
              readOnly
              className="w-full"
              placeholder="请输入端口"
            />
          </Form.Item>
        </Col>
        <Col span={18}>
          <Form.Item label="启用">
            <Switch />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item label="名称">
        <Input
          className="w-full"
          placeholder="请输入名称"
        />
      </Form.Item>
      <Form.Item label="配置">
        <Input.TextArea
          placeholder="请输入配置代码"
          autoSize={{ minRows: 12 }}
        />
      </Form.Item>
      <Form.Item>
        <div className="w-full flex justify-between">
          <span></span>
          <Button type="primary">保存</Button>
        </div>
      </Form.Item>
    </Form>
  </div>;
}
