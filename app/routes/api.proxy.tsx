import { ActionFunctionArgs, json } from "@remix-run/node";

export
async function action({ request }: ActionFunctionArgs) {
  console.log(request);
  return json({ hello: request.url });
}
