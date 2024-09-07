const { AssetDAO, PostDAO } = require("../../dao");
const Cursor = require("../../database/cursor");

async function deducePostWithTags(userTags, options) {
  const logLocation = "InternalPostCursorService.fetchPostsByTags";
  try {
    const { postCursor, assetsCursor } = decodeCursor(options.cursor);

    const postOptions = {
      ...options,
      cursor: postCursor,
    };
    const assetOptions = {
      ...options,
      cursor: assetsCursor,
    };
    
    const assetResults = await AssetDAO.findAssetIdsByTag(
      userTags,
      assetOptions
    );

    const postResults = await PostDAO.listByAssets(
      assetResults.assetIds,
      postOptions
    );
    return {
      data: postWithTags,
      cursor: encodeCursor({
        postCursor: postResults.nextCursor,
        assetCursor: assetResults.nextCursor,
      }),
    };
  } catch (error) {
    throw new ErrorWithContext(
      error,
      new ErrorContext(logLocation, { userTags, cursor })
    );
  }
}

function decodeCursor(cursor) {
  if (cursor != null) {
    const decodeCursor = Cursor.decode(cursor);
    return {
      postCursor: decodeCursor.postCursor,
      assetsCursor: decodeCursor.assetCursor,
    };
  }
  return null;
}

function encodeCursor(entityObj) {
  return Cursor.encode(entityObj);
}

module.exports = {
  deducePostWithTags,
};
