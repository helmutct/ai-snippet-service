import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("snippets", "routes/snippets.tsx"),
  route("snippets/:id", "routes/snippets.$id.tsx"),
  route("snippets/:id/delete", "routes/snippets.$id.delete.tsx"),
] satisfies RouteConfig;
