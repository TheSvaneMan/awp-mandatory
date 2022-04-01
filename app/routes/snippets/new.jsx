import { Form, redirect, json, useActionData } from "remix";
import connectDb from "~/db/connectDb.server";

export async function action({ request }) {
  const form = await request.formData();
  const db = await connectDb();
  try {
    if (form.get('title') === '') {
      return json({errors: 'Field cannot be empty'}, { status: 400 })
    }
    let favoriteBool = false;
    if (form.get('favorite') === 'favorite') {
      favoriteBool = true;
    }
    const newSnippet = await db.models.Snippet.create({
      title: form.get("title"),
      language: form.get("language"),
      code: form.get("code"),
      description: form.get("description"),
      favorite: favoriteBool,
      uploaded: new Date()
    });
    return redirect(`/snippets/${newSnippet._id}`);
  } catch (error) {
    return json(
      { errors: error.errors, values: Object.fromEntries(form) },
      { status: 400 }
    );
  }
}

export default function CreateBook() {
  const actionData = useActionData();
  return (
    <div className='grid grid-cols-1 justify-items-center bg-slate-700 p-4 rounded-lg mt-10'>
      <h1 className='text-gray-200 text-2xl mb-5'>Create new code snippet</h1>
      <Form method="post" className='grid grid-cols-1 justify-items-center bg-slate-900 rounded-lg p-4 space-y-5'>
        <div className="formElement">
          <label htmlFor="title" className="block">
            Title
          </label>
          <input
            type="text"
            name="title"
            defaultValue={actionData?.values.title}
            id="title"
            className={
              actionData?.errors.title ? "border-2 border-red-500 text-black" : "text-black p-4 rounded-lg"
            }
          />
          {actionData?.errors.title && (
            <p className="text-red-500">{actionData.errors.title.message}</p>
          )}
        </div>
        <div className="formElement">
          <label htmlFor="language" className="block">
            Language
          </label>
          <input
            type="text"
            name="language"
            defaultValue={actionData?.values.language}
            id="language"
            className={
              actionData?.errors.language ? "border-2 border-red-500 text-black" : "text-black p-4 rounded-lg"
            }
          />
          {actionData?.errors.language && (
            <p className="text-red-500">{actionData.errors.language.message}</p>
          )}
        </div>
        
         <div className="formElement">
          <label htmlFor="code" className="block">
            Code
          </label>
          <textarea
            type="text"
            name="code"
            defaultValue={actionData?.values.code}
            id="code"
            className={
              actionData?.errors.code ? "border-2 border-red-500 text-black" : "text-black p-4 rounded-lg"
            }
          />
          {actionData?.errors.code && (
            <p className="text-red-500">{actionData.errors.code.message}</p>
          )}
        </div>
        <div className="formElement">
          <label htmlFor="description" className="block">
            Description
          </label>
          <input
            type="text"
            name="description"
            defaultValue={actionData?.values.description}
            id="description"
            className={
              actionData?.errors.description ? "border-2 border-red-500 text-black" : "text-black p-4 rounded-lg"
            }
          />
          {actionData?.errors.description && (
            <p className="text-red-500">{actionData.errors.description.message}</p>
          )}
        </div>
        <div className="formElement grid grid-cols-1 justify-items-center space-y-5">
          <label htmlFor="favorite" className="block">
            Favorite
          </label>
          <input
            type="checkbox"
            name="favorite"
            defaultValue={actionData?.values.favorite}
            id="favorite"
            value="favorite"
            className="appearance-none bg-slate-800 h-10 w-10 border-2 border-white hover:-translate-y-1 transition rounded-3xl default:ring-2 checked:bg-orange-400"
          />
          {actionData?.errors.favorite && (
            <p className="text-red-500">{actionData.errors.favorite.message}</p>
          )}
        </div>
       
        <br />
        <button type="submit" className='bg-indigo-600 p-4 rounded-lg hover:bg-indigo-300 hover:-translate-y-2 hover:text-black transition '>Save</button>
      </Form>
    </div>
  );
}
