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
      <body className="grid bg-slate-800 text-slate-100 font-mono p-4">
        <header className="grid grid-cols-3 place-content-evenly px-2 py-5 border-b-2">
          <Link to="/" className="hover:underline bg-indigo-900 p-2 rounded-lg">
            Home
          </Link>
          <Link to="/seed" className="ml-3 hover:underline bg-red-600 p-2 rounded-lg">
            ReSeed DB
          </Link>
          <Link to="/snippets/new" className="ml-3 hover:underline bg-indigo-600 p-2 rounded-lg">
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
