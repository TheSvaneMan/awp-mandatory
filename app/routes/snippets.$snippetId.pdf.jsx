import connectDb from "~/db/connectDb.server.js";

export async function loader({ params }) {
  const db = await connectDb();
  const snippet = await db.models.Snippet.findById(params.snippetId);
  const pdf = await createPDF(snippet);
  return new Response(pdf.document, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
    },
  });
}
