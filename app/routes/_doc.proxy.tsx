import { MetaFunction } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [{ title: "LiteProxy" }];
};

export default
function DocProxy() {
  return <div>代理</div>;
}
