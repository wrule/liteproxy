import { LoaderFunctionArgs, json } from "@remix-run/node";
import { MetaFunction, useLoaderData } from "@remix-run/react";
import hub from "../core";

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
          {page.list.map((item) => <tr className="border-b">
            <td className="px-2 py-1">{item.port}</td>
            <td className="px-2 py-1">{item.name}</td>
            <td className="px-2 py-1">{item.enabled}</td>
            <td className="px-2 py-1"></td>
          </tr>)}
        </tbody>
      </table>
    </div>
  </div>;
}
