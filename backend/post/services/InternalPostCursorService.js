const { AssetDAO, PostDAO } = require("../../dao");
const Cursor = require("../../database/cursor");
const { ErrorWithContext, ErrorContext } = require("../../errors/ErrorContext");
const { fetchDecodedCursor } = require("../../util/Utility");
const logger = require("../../logger/logger");

async function deducePostWithTags(userTags, options) {
  const logLocation = "InternalPostCursorService.fetchPostsByTags";
  try {
    const decodedCursor = fetchDecodedCursor(options.cursor);

    const postOptions = {
      ...options,
      cursor: decodedCursor?.postCursor,
    };
    const assetOptions = {
      ...options,
      cursor: decodedCursor?.assetsCursor,
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
      postWithTags: postResults.posts,
      nextCursor: encodeCursor({
        postCursor: postResults.nextCursor,
        assetCursor: assetResults.nextCursor,
      }),
    };
  } catch (error) {
    throw new ErrorWithContext(
      error,
      new ErrorContext(logLocation, { userTags, options })
    );
  }
}


function encodeCursor(entityObj) {
  return Cursor.encode(entityObj);
}

module.exports = {
  deducePostWithTags,
};
