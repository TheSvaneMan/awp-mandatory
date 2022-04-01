import {
  Links,
  Link,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix";
import styles from "~/tailwind.css";

export const links = () => [
  {
    rel: "stylesheet",
    href: styles,
  },
];

export function meta() {
  return {
    charset: "utf-8",
    title: "Remix + MongoDB",
    viewport: "width=device-width,initial-scale=1",
  };
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-slate-800 text-slate-100 font-mono p-4">
        <header className="grid grid-cols-2 justify-end px-2 py-10 border-b-2">
          <Link to="/" className="hover:underline bg-indigo-800 p-4 rounded-lg">
            Home
          </Link>
          <Link to="/snippets/new" className="ml-3 hover:underline bg-indigo-600 p-4 rounded-lg">
            New Snippet
          </Link>
        </header>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
