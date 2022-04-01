import { useLoaderData, Link } from "remix";
import connectDb from "~/db/connectDb.server.js";

export async function loader() {
  const db = await connectDb();
  const snippets = await db.models.Snippet.find();
  return snippets;
}

export default function Index() {
  const snippets = useLoaderData();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Remix + Mongoose</h1>
      <h2 className="text-lg font-bold mb-3">
        A code snippet web app
      </h2>
      <h3 className='text-md mb-3'>
        Here are a few of my favorite code snippets:</h3>
      <ul className="grid grid-cols-1 justify-items-center ml-5 space-y-5">
        {snippets.map((snippet) => {
          return (
              <Link
                 key={snippet._id} 
                to={`/snippets/${snippet._id}`}
                className="bg-indigo-600 p-4 rounded-lg hover:bg-indigo-300 hover:-translate-y-2 hover:text-black transition ">
                {snippet.title}
              </Link>
          );
        })}
      </ul>
    </div>
  );
}
