
function findDeltaBetwn2Sets(set1, set2) {
  const difference = new Set([...set1].filter(x => !set2.has(x)));
  return difference;
}

async function updateChangedFields(reqBody, user) {
    // Object to hold fields that have changed
    let updates = {};
  
    // List of fields to check for changes
    const fieldsToCheck = ['name', 'email', 'username', 'phone', 'bio', 'avatarUrl', 'website'];
  
    // Check each field for changes
    fieldsToCheck.forEach(field => {
      if (reqBody[field] !== undefined && reqBody[field] !== user[field]) {
        updates[field] = reqBody[field];
      }
    });
  
    return updates;
  }


module.exports = {
    findDeltaBetwn2Sets,
    updateChangedFields
};