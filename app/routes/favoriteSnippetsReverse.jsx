import { Form,  useLoaderData, Link, json, redirect } from "remix";
import { updateFavorite, determineAction } from '~/db/formActionHandler.js';
import connectDb from "~/db/connectDb.server.js";
import { useEffect, useState } from 'react';

export async function loader() {
  const db = await connectDb();
  const query = { "favorite": false}
  const snippets = await db.models.Snippet.find(query);
  return snippets;
}


// -------- Form Action Handler -------- //
export async function action({ request }) {
  const form = await request.formData();
  const params = form._fields;
  const db = await connectDb();
  try {
    // Determine Form Action
    const actionState = determineAction(params);
    switch (actionState) {
      case "Default":
        return redirect("/");
      case "filterFavorites":
        const query = { "favorite": true }
        return redirect(`/favoriteSnippets/`);
      case "sortByTitle":
        return redirect("/snippetNameSorted");
      case "latestSnippets":
        return redirect("/latestSnippet");
      case "toggleFavorite":
        const snippetId = params.toggleFavorite;
        const updateFavoriteStatus = await updateFavorite(db, snippetId);
        return ("/");
      case "search":
        if (params.searchValue.toString() === '') {
          return ("/")
        } else {
          return redirect(`/search/${params.searchValue}`);
        }
    } 
  } catch (error) {
    return json(
      {errors: error.errors, values: Object.fromEntries(form)},
      {status: 400}
    )
  }
}
export default function Index() {
  const snippetsData = useLoaderData();
  const [snippets, setSnippets] = useState(snippetsData);

  useEffect(() => setSnippets(snippetsData), [snippetsData]);

  return (
    <div id="home">
      <h1 className="text-2xl font-bold mb-4">Remix + Mongoose</h1>
      <h2 className='text-lg text-gray-200'> A Code Snippet Web App</h2>
      <h3 className=' text-orange-400 mb-4'>Tailored for Mobile</h3>
      <Form method='POST'>
      <div id="searchBar" className='grid grid-cols-1 mb-5 space-y-2'>
          <input type="text" id="searchValue" name="searchValue" placeholder='search snippet by title' className='text-black p-4 rounded-lg' />
          <input type="submit" id="submitSearch" name="submitSearch" value="search" placeholder='search snippet by title' className='bg-slate-900 text-white p-4 rounded-lg' />
      </div>
        <div id="filters" className='grid grid-cols-2 place-content-evenly gap-4 mb-5'>
        <input id="defaultState" name="defaultState" type="submit" value="Default"  className="hover:-translate-y-2 transition hover:bg-slate-800 bg-blue-600 rounded-lg p-4"/>
        <input id="filterFavorites" name="filterFavorites" type="submit" value="Favorites"  className="hover:-translate-y-2 transition hover:bg-violet-900 bg-violet-600 rounded-lg p-4"/>
        <input id="sortByTitle" name="sortByTitle" value="A-Z" type="submit" className="hover:-translate-y-2  transition hover:bg-violet-900 bg-violet-600 rounded-lg p-4" />
        <input id="sortByLastUpdated" name="sortByUpdatedAt" value="Last updated" type="submit" className="hover:-translate-y-2 transition hover:bg-violet-900 bg-violet-600 rounded-lg p-4" />
      </div>
      <p className="mb-4"><i>Your unfavorited code snippets.</i></p>
        <ul className="grid grid-cols-1 space-y-5 ">
          {snippets.length === 0 ? <div className='grid'><p className='mb-5'>You have favorited all your code snippets. Good for you. :)</p><Link to="/"  className="hover:-translate-y-2  transition hover:bg-violet-900 bg-violet-600 rounded-lg p-4">See all snippets</Link></div> :  snippets.map((snippet) => {
          return (
            <li key={snippet._id} className="grid grid-cols-1 align-middle bg-indigo-700 rounded-lg" >
              <Link
                to={`/snippets/${snippet._id}`}
                className="bg-indigo-600 p-4 text-2xl  rounded-lg hover:bg-indigo-300 hover:-translate-y-2 hover:text-black transition ">
                {snippet.title}
              </Link>
              <div id="snippet-sub" className="grid grid-cols-2 justify-items-center">
                <div id="last-updated" className='p-2'>
                  <p>
                    Last Updated
                  </p>
                  <p>{snippet.updatedAt}</p>
                </div>
              <div className="favorite-element grid grid-cols-1 space-x-2 align-middle p-2">
                <label htmlFor="favorite" className="flex justify-items-center align-middle">
                  Favorite
                  </label>
                  <input type="submit" name="toggleFavorite" id="toggleFavorite" value={snippet._id} className={snippet.favorite === true ? "appearance-none text-transparent bg-orange-400 h-10 w-14 border-2 border-white hover:-translate-y-1 transition rounded-3xl default:ring-2" : "appearance-none text-transparent bg-slate-800 h-10 w-14 border-2 border-white hover:-translate-y-1 transition rounded-3xl default:ring-2" } />
              </div>
              </div>
            </li>
          );
        })}
      </ul>
      </Form> 
    </div>
  );
}
