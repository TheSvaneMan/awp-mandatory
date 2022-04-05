import { useEffect, useState } from 'react';
import { useLoaderData, json, Link, Form, redirect, useCatch } from 'remix';
import connectDb from '~/db/connectDb.server';
import snippetSeed from "~/db/seed.json";

export async function loader({ params }) {
    const db = await connectDb();
    const currentSnippetAmount = await db.models.Snippet.countDocuments();
    return json(currentSnippetAmount);
}

export async function action({ request }) {
    const form = await request.formData();
    const params = form._fields;
    const db = await connectDb();
    try {
        // Delete all Snippets on Database
        const deletedManySnippets = await db.models.Snippet.deleteMany();
        if (deletedManySnippets.acknowledged === true) {
             // Inset Default Seed to Database
            const insetDefaultSeedSnippets = await db.models.Snippet.insertMany(snippetSeed);
            return redirect ("/");
        }
    } catch (error) {
        return json(
        {errors: error.errors, values: Object.fromEntries(form)},
        {status: 400}
        )
    }
}

export default function SeedSnippets() {
    const snippetCount = useLoaderData();
    const snippetJSON = snippetSeed;
    return (
        <Form method='POST' action='' className='grid grid-cols-1 justify-items-center bg-gradient-to-r from-indigo-500 via-blue-900 to-indigo-500 text-white rounded-lg shadow-lg p-4 mt-10'>
            <h1 className='text-2xl mb-5'>Seeding the database</h1>
            <h2 className='text-xl mb-10'>You currently have <b>{snippetCount}</b> snipppets in your database.</h2>
            <p className='mb-4 text-lg'>Do you want to delete them and re-seed the database with <b>{snippetJSON.length}</b> default snippets?</p>
            <p>You are about to reseed your database, are you sure you want to continue?</p>
            <div id="seed-options" className='grid grid-cols-2 mt-5'>
                <input type="submit" name="acceptSeed" id="acceptSeed" value="Accept" className="ml-3 transition hover:bg-red-600 bg-red-800  p-4 rounded-lg" />
                <Link to="/" className="ml-3 transition hover:bg-blue-500 bg-blue-600 p-4 rounded-lg">
                    Decline
                </Link>
            </div>
        </Form>
    )
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <div>
      <h1>
        {caught.status} {caught.statusText}
      </h1>
      <h2>{caught.data}</h2>
    </div>
  );
}

export function ErrorBoundary({ error }) {
  return (
    <h1 className="text-red-500 font-bold">
      {error.name}: {error.message}
    </h1>
  );
}