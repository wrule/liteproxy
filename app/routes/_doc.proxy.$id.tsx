import { MetaFunction } from "@remix-run/react";
import { Button, Form, Input, InputNumber, Switch } from "antd";

export const meta: MetaFunction = () => {
  return [{ title: "DEMO About" }];
};

export default
function DocProxyDetail() {
  return <div className="p-4">
    <Form
      layout="vertical">
      <Form.Item label="端口">
        <InputNumber className="w-full" readOnly />
      </Form.Item>
      <Form.Item label="名称">
        <Input
          className="w-full"
          placeholder="请输入名称"
        />
      </Form.Item>
      <Form.Item label="启用">
        <Switch />
      </Form.Item>
      <Form.Item label="配置">

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
