import { Form, useLoaderData, useCatch, json, redirect, Link } from "remix";
import { useState, useEffect } from 'react';
import { determineAction, updateSnippet, deleteSnippet } from '~/db/formActionHandler.js';
import connectDb from "~/db/connectDb.server.js";

export async function loader({ params }) {
  const db = await connectDb();
  const snippet = await db.models.Snippet.findById(params.snippetId);
  if (!snippet) {
    throw new Response(`Couldn't find snippet with id ${params.snippetId}`, {
      status: 404,
    });
  }
  return json(snippet);
}

// -------- Form Action Handler -------- //
export async function action({ request }) {
  const form = await request.formData();
  const params = form._fields;
  const db = await connectDb();
  const snippetId = params.snippetId;
  try {
    // Determine Form Action
    const actionState = determineAction(params);
      // Handle Update Action
    switch (actionState){
      case "updateSnippet":
        const snippetUpdate = await updateSnippet(db, params, snippetId);
        return ("/");
      case "deleteSnippet":
        // Delete specific snippet
        const snippetDelete = await deleteSnippet(db, snippetId);
        return redirect("/");
    }  
  } catch (error) {
    return json(
      {errors: error.errors, values: Object.fromEntries(form)},
      {status: 400}
    )
  }
}

export default function SnippetPage() {
  const snippet = useLoaderData();
  const [tags, setTags] = useState(snippet.tags);

  // Add Tags
  const handleTag = (e) => {
      e.preventDefault();
      const tag = document.getElementById('tag').value;
      // Check if tag already exists, if it does - do nothing
      const hasMatch = tags.some(function (storedTag) {
        return storedTag == tag
      });
      if (!hasMatch) {
        setTags([...tags, tag]);
      }
  }

  const removeTag = (e) => {
    e.preventDefault();
    const updatedTags = tags.filter((tag) => { return tag !== e.target.value })
    setTags(updatedTags);
  }

  return (
    <Form method='POST' action='' className="grid grid-cols-1 space-y-5 p-4">
      <div className="form-element grid grid-cols-1 space-y-4">
        <label htmlFor="title" className="block">
            Title
        </label>
        <input type="hidden" name="snippetId" id="snippetId" value={snippet._id} />
        <input id="title" name="title" defaultValue={snippet.title} className="text-xl font-bold text-black rounded-lg p-2" />
      </div>
      <div className="form-element grid grid-cols-1 space-y-4">
        <label htmlFor="language" className="block">
            Language
        </label>
        <input id="language" name="language"  defaultValue={snippet.language} className='text-slate-200 p-2 bg-black rounded-lg' />
      </div>
      <div className="form-element grid grid-cols-1 space-y-4">
        <label htmlFor="tags" className="block">
            Tags
        </label>
        <input type="hidden" value={tags} id="tags" name="tags" />
        <ul className={tags.length === 0 ? "grid grid-cols-1 text-orange-600" : "grid grid-cols-3 align-middle"}>
          {
            tags.length === 0 ? "There are currently no tags for this code snippet." : tags.map(tag => {
              return (
                <button key={tag} className='grid grid-cols-1 justify-items-center ml-2 mb-2 p-2 h-10 align-middle bg-lime-600 rounded-lg text-white' value={tag} onClick={removeTag}>
                    {tag}
                </button>)
            })
          }
        </ul>
        <input placeholder='tag' type="text" id="tag" name="tag" maxLength="8" minLength="1" className="text-lg my-2 text-black rounded-lg p-2" />
        <div id="codeTag" className='grid grid-cols-1 justify-items-end space-y-4'>
          <button onClick={handleTag} className='bg-orange-600 p-2 rounded-lg hover:bg-orange-300 hover:-translate-y-2 hover:text-black transition ' >Add Tag</button>
        </div>
      </div>
           <div className="formElement grid grid-cols-1 ">
          <label htmlFor="code" className="block">
            Code
          </label>
          <textarea id='code' name='code' defaultValue={snippet.code} className="p-2 text-black rounded-lg" />
        </div>
       <div className="formElement grid grid-cols-1 ">
          <label htmlFor="description" className="block">
            Description
          </label>
          <textarea
            type="text"
            name="description"
            defaultValue={snippet.description}
            id="description"
            className="text-black p-4 rounded-lg"
          />
        </div>
      <div className="formElement grid grid-cols-1 justify-items-center space-y-5">
          <label htmlFor="favorite" className="block">
            Favorite
          </label>
          <input
            type="checkbox"
            name="favorite"
            defaultChecked={snippet.favorite === true ? "checked" : null}
            defaultValue={snippet.favorite}
            id="favorite"
            className="appearance-none bg-slate-800 h-10 w-10 border-2 border-white hover:-translate-y-1 transition rounded-3xl default:ring-2 checked:bg-orange-400"
        />   
        </div>
      <div className="snippetHandler grid grid-cols-2 gap-4 justify-items-center">
        <button type="submit" id='deleteSnippet' name='deleteSnippet' value='deleteSnippet' placeholder='Delete Snippet' className='bg-red-600 p-4 rounded-lg hover:bg-red-300 hover:-translate-y-2 hover:text-black transition'>Delete Snippet</button>
        {/* <Link to={`/snippets/${snippet._id}/pdf`} className='bg-blue-600 p-4 rounded-lg hover:bg-blue-400 hover:-translate-y-2 hover:text-black transition'  reloadDocument> 
          View as PDF
        </Link> */}
        <button type="submit" id='updateSnippet' name='updateSnippet' value='updateSnippet' placeholder='Update Snippet' className='bg-indigo-800 p-4 rounded-lg hover:bg-indigo-300 hover:-translate-y-2 hover:text-black transition'>Update Snippet</button> 
      </div>
     </Form>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <div className='grid grid-cols-1 bg-slate-900 p-4 rounded-lg shadow-lg mt-5 space-y-10'>
      <h3>Whoopsies</h3>
      <div className='px-10 animate-pulse transition delay-300'> 
        <h1>
          {caught.status} {caught.statusText}
        </h1>
        <h2><b>{caught.data}</b></h2>
      </div>
      <Link to="/" className="ml-3 transition hover:bg-slate-500 bg-slate-600 p-4 rounded-lg">
          Return to Home Page :)
      </Link>
    </div>
  );
}

export function ErrorBoundary({ error }) {
  return (
   
    <div className='grid grid-cols-1 bg-slate-900 p-4 rounded-lg shadow-lg mt-5 space-y-10'>
      <h3>Whoopsies, Error found:</h3>
      <div className='px-10 animate-pulse transition delay-300'> 
         <h1 className="text-white font-bold">
            {error.name}: {error.message}
        </h1>
      </div>
      <Link to="/" className="ml-3 transition hover:bg-slate-500 bg-slate-600 p-4 rounded-lg">
          Return to Home Page :)
      </Link>
    </div>
  );
}
