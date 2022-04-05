import { json } from 'remix';
import mongoose from 'mongoose';

// -------- Determines Action Request State -------- //
export function determineAction(params) {
  if (params.defaultState !== undefined) {
      return params.defaultState.toString();
  } else if (params.updateSnippet !== undefined) {
      return params.updateSnippet.toString();
  } else if (params.deleteSnippet !== undefined) {
      return params.deleteSnippet.toString();
  } else if (params.sortByTitle !== undefined) {
    return "sortByTitle";
  } else if (params.filterFavorites !== undefined){
    return "filterFavorites";
  } else if (params.sortByUpdatedAt !== undefined){
    return "latestSnippets";
  } else if (params.toggleFavorite !== undefined){
    return "toggleFavorite";
  } else if (params.submitSearch !== undefined){
    return params.submitSearch.toString();
  } 
}
// -------- Form Actions -------- //
export const deleteSnippet = async (db, snippetId) => {
  try {
    const query = { "_id": snippetId }
    const result = await db.models.Snippet.deleteOne(query);
    let responseMessage;
    if (result.deletedCount === 1) {
      console.log("Successfully deleted one document");
      responseMessage = { message: "Successfully deleted one document", code: 200 }
    } else {
        console.log("No documents matched the query. Deleted 0 documents");
        responseMessage = { message: "No documents matched the query. Deleted 0 documents", code: 400 }
    }
    return responseMessage;
  } catch (error) {
    return json(
      {errors: error.errors, values: `Error with doc: ${snippetId}`},
      {status: 400}
    )
  }
}

export const updateFavorite = async (db, snippetId) => {
  try {
    const snippet = await db.models.Snippet.findById(snippetId);
    let bool = false;
    bool = !snippet.favorite;
    snippet.favorite = bool;
    snippet.updatedAt = new Date();
    await snippet.save();
  } catch (error) {
    return json(
      {errors: error.errors, values: `Error with updating favorites of: ${snippetId}`},
      {status: 400}
    )
  }
}

export const updateSnippet = async (db, params, snippetId) => {
  try {
    const snippet = await db.models.Snippet.findById(snippetId);
    const tagsArray = params.tags.toString().split(",");
    let bool = false;
    bool = snippet.favorite === 'true';
    let favState;
    if (params.favorite === undefined) {
      favState = bool;
    } else {
      favState = !bool;
    }
    snippet.title = params.title.toString();
    snippet.language = params.language.toString();
    snippet.description = params.description.toString();  
    snippet.code = params.code.toString();
    snippet.tags = tagsArray;
    snippet.favorite = favState;
    snippet.updatedAt = new Date();
    await snippet.save();
  } catch (error) {
    return json(
      {errors: error.errors, values: `Error updating snippet: ${snippetId}`},
      {status: 400}
    )
  }
}
