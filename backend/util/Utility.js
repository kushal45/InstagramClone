const { Op } = require('sequelize');
const Cursor = require('../database/cursor');

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}



/**
 * Adds cursor condition to select options.
 *
 * @param {Object} selectOpt - The select options object.
 * @param {Object} options - The options object containing cursor.
 */
function addCursorCondition(selectOpt, options) {
  if (options.cursor) {
     const decodedCursor = Cursor.decode(options.cursor);
      selectOpt.where = selectOpt.where || {};
      selectOpt.where.id = {
          [Op.gt]: decodedCursor.id,
      };
  }
}

/**
 * Adds limit to select options.
 *
 * @param {Object} selectOpt - The select options object.
 * @param {Object} options - The options object containing limit.
 */
function addLimit(selectOpt, options) {
  if (options.limit) {
      selectOpt.limit = options.limit;
  }
}

/**
 * Adds order to select options.
 *
 * @param {Object} selectOpt - The select options object.
 * @param {Object} options - The options object containing order.
 */
function addOrder(selectOpt, options) {
  if (options.order) {
      selectOpt.order = [["createdAt",capitalize(options.order)]];
  }
}

/**
 * Adds attributes to select options.
 *
 * @param {Object} selectOpt - The select options object.
 * @param {Object} options - The options object containing attributes.
 */
function addAttributes(selectOpt, options) {
  if (options.attributes) {
      selectOpt.attributes = options.attributes;
  }
}

function fetchLastCursor(entity){
  if(entity.length > 0){
    const lastEntiy = entity[entity.length - 1];
    return Cursor.encode(lastEntiy);
  }
  return null;
}

/**
 * Populates select options based on provided options.
 *
 * @param {Object} selectOpt - The select options object.
 * @param {Object} options - The options object containing various parameters.
 * @returns {Object} - The populated select options object.
 */
function populateSelectOptions(selectOpt, options) {
  if (options) {
      addCursorCondition(selectOpt, options);
      addLimit(selectOpt, options);
      addAttributes(selectOpt, options);
      addOrder(selectOpt, options);
  }
  return selectOpt;
}

function fetchDecodedCursor(cursor){
  if (cursor!=null && cursor!=="") {
    const decodedCursor = Cursor.decode(cursor);
    return decodedCursor;
  }
  return null;
}

module.exports = { populateSelectOptions , fetchLastCursor, fetchDecodedCursor};