import { MetaFunction } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [{ title: "LiteProxy" }];
};

export default
function DocProxy() {
  return <div className="p-4">
    <div></div>
    <div>
      <table className="w-full bg-white border-t border-x text-left">
        <thead>
          <tr className="border-b">
            <th className="px-2 py-1">端口</th>
            <th className="px-2 py-1">名称</th>
            <th className="px-2 py-1">状态</th>
            <th className="px-2 py-1">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="px-2 py-1">8080</td>
            <td className="px-2 py-1">默认</td>
            <td className="px-2 py-1">已启用</td>
            <td className="px-2 py-1"></td>
          </tr>
          <tr className="border-b">
            <td className="px-2 py-1">8081</td>
            <td className="px-2 py-1">默认</td>
            <td className="px-2 py-1">已启用</td>
            <td className="px-2 py-1"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>;
}
