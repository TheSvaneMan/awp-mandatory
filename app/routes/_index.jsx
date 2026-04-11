import { Form, Link, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { updateFavorite, determineAction } from "~/db/formActionHandler";
import connectDb from "~/db/connectDb.server";
import { useEffect, useState } from "react";

// -------- Loader -------- //
export async function loader() {
  try {
    const db = await connectDb();
    const snippets = await db.models.Snippet.find();
    return json({ snippets, error: null });
  } catch (err) {
    console.error("Database Connection Error:", err.message);
    // Return empty snippets and the error message so the UI doesn't crash
    return json({
      snippets: [],
      error:
        "⚠️ Database connection failed. Please set a valid MongoDB URI in your .env file.",
    });
  }
}

// -------- Form Action Handler -------- //
export async function action({ request }) {
  const form = await request.formData();
  // Fallback to Object.fromEntries if _fields is undefined
  const params = form._fields || Object.fromEntries(form);

  try {
    // Moved inside the try block so it doesn't crash the server on submit
    const db = await connectDb();

    // Determine Form Action
    const actionState = determineAction(params);
    switch (actionState) {
      case "Default":
        return redirect("/");
      case "filterFavorites":
        return redirect(`/favoriteSnippets/`);
      case "sortByTitle":
        return redirect("/snippetNameSorted");
      case "latestSnippets":
        return redirect("/latestSnippet");
      case "toggleFavorite":
        const snippetId = params.toggleFavorite;
        await updateFavorite(db, snippetId);
        return redirect("/");
      case "search":
        if (!params.searchValue || params.searchValue.toString() === "") {
          return redirect("/");
        } else {
          return redirect(`/search/${params.searchValue}`);
        }
      default:
        return redirect("/");
    }
  } catch (error) {
    return json(
      {
        errors: error.message || "Action failed",
        values: Object.fromEntries(form),
      },
      { status: 400 }
    );
  }
}

// -------- Component -------- //
export default function Index() {
  // Destructure the new object returned from the loader
  const { snippets: initialSnippets, error } = useLoaderData();
  const [snippets, setSnippets] = useState(initialSnippets);

  useEffect(() => setSnippets(initialSnippets), [initialSnippets]);

  return (
    <div id="home">
      <h1 className="text-2xl font-bold mb-4">Remix + Mongoose</h1>
      <h2 className="text-lg text-gray-200"> A Code Snippet Web App</h2>
      <h3 className="text-orange-400 mb-4">Tailored for Mobile</h3>

      {/* Conditionally render the DB warning if the loader caught an error */}
      {error && (
        <div className="bg-red-900 border border-red-500 text-red-100 p-4 rounded-lg mb-6 shadow-lg">
          <p className="font-semibold">{error}</p>
        </div>
      )}

      <Form method="POST">
        <div id="searchBar" className="grid grid-cols-1 mb-5 space-y-2">
          <input
            type="text"
            id="searchValue"
            name="searchValue"
            placeholder="search snippet by title"
            className="text-black p-4 rounded-lg"
          />
          <input
            type="submit"
            id="submitSearch"
            name="submitSearch"
            value="search"
            className="bg-slate-900 text-white p-4 rounded-lg cursor-pointer"
          />
        </div>

        <div
          id="filters"
          className="grid grid-cols-2 place-content-evenly gap-4 mb-5"
        >
          <input
            id="defaultState"
            name="defaultState"
            type="submit"
            value="Default"
            className="hover:-translate-y-2 transition hover:bg-slate-800 bg-blue-600 rounded-lg p-4 cursor-pointer"
          />
          <input
            id="filterFavorites"
            name="filterFavorites"
            type="submit"
            value="Favorites"
            className="hover:-translate-y-2 transition hover:bg-violet-900 bg-violet-600 rounded-lg p-4 cursor-pointer"
          />
          <input
            id="sortByTitle"
            name="sortByTitle"
            value="A-Z"
            type="submit"
            className="hover:-translate-y-2 transition hover:bg-violet-900 bg-violet-600 rounded-lg p-4 cursor-pointer"
          />
          <input
            id="sortByLastUpdated"
            name="sortByUpdatedAt"
            value="Recently updated"
            type="submit"
            className="hover:-translate-y-2 transition hover:bg-violet-900 bg-violet-600 rounded-lg p-4 cursor-pointer"
          />
        </div>

        <p className="mb-4">
          <i>No filters have been applied.</i>
        </p>

        <ul className="grid grid-cols-1 space-y-5">
          {snippets.length === 0 ? (
            <div className="mt-10 grid bg-blue-500 text-white p-4 rounded-lg">
              <p className="animate-pulse transition delay-150">
                You currently have no code snippets, click here to add a new one
                to get started :)
              </p>
              {/* Disable the link visually if the DB is disconnected to prevent further crashes */}
              <Link
                to={error ? "#" : "/snippets/new"}
                className={`mt-5 grid justify-items-center p-2 rounded-lg ${
                  error
                    ? "bg-gray-500 cursor-not-allowed opacity-50"
                    : "hover:bg-orange-400 bg-orange-600"
                }`}
                onClick={(e) => {
                  if (error) {
                    e.preventDefault();
                    alert(
                      "Please connect the database before creating snippets."
                    );
                  }
                }}
              >
                Create new Snippet
              </Link>
            </div>
          ) : (
            snippets.map((snippet) => {
              return (
                <li
                  key={snippet._id}
                  className="grid grid-cols-1 align-middle bg-indigo-700 rounded-lg"
                >
                  <Link
                    to={`/snippets/${snippet._id}`}
                    className="bg-indigo-600 p-4 text-2xl rounded-lg hover:bg-indigo-300 hover:-translate-y-2 hover:text-black transition"
                  >
                    {snippet.title}
                  </Link>
                  <div
                    id="snippet-sub"
                    className="grid grid-cols-2 justify-items-center"
                  >
                    <div id="last-updated" className="p-2">
                      <p>Last Updated</p>
                      <p>{snippet.updatedAt}</p>
                    </div>
                    <div className="favorite-element grid grid-cols-1 space-x-2 align-middle p-2">
                      <label
                        htmlFor={`toggleFavorite-${snippet._id}`}
                        className="flex justify-items-center align-middle"
                      >
                        Favorite
                      </label>
                      <input
                        type="submit"
                        name="toggleFavorite"
                        id={`toggleFavorite-${snippet._id}`}
                        value={snippet._id}
                        className={
                          snippet.favorite === true
                            ? "appearance-none text-transparent bg-orange-400 h-10 w-14 border-2 border-white hover:-translate-y-1 transition rounded-3xl cursor-pointer"
                            : "appearance-none text-transparent bg-slate-800 h-10 w-14 border-2 border-white hover:-translate-y-1 transition rounded-3xl cursor-pointer"
                        }
                      />
                    </div>
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </Form>
    </div>
  );
}
