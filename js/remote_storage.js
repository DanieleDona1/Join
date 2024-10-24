/**
 * Sends a POST request to add data to the specified path.
 * @async
 * @param {string} [path=""] - The endpoint path to which data will be added.
 * @param {Object} [data={}] - The data to be sent in the request body.
 * @returns {Promise<Object>} The JSON response from the server.
 * @function postData
 */
async function postData(path = '', data = {}) {
  let response = await fetch(BASE_URL + path + '.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return (responseToJson = await response.json());
}

/**
 * Sends a PUT request to update data at the specified path.
 * @async
 * @param {string} [path=""] - The endpoint path where data will be updated.
 * @param {Object} [data={}] - The data to be sent in the request body.
 * @returns {Promise<Object>} The JSON response from the server.
 * @function putData
 */
async function putData(path = '', data = {}) {
  let response = await fetch(BASE_URL + path + '.json', {
    method: 'PUT', // Überschreibt den Wert im gewählten Pfad
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return (responseToJson = await response.json());
}

/**
 * Sends a DELETE request to remove data at the specified path.
 * @async
 * @param {string} [path=""] - The endpoint path from which data will be deleted.
 * @returns {Promise<Object>} The JSON response from the server.
 * @function deleteData
 */
async function deleteData(path = '') {
  let response = await fetch(BASE_URL + path + '.json', {
    method: 'DELETE',
  });
  return (responseToJson = await response.json());
}

/**
 * Sends a PATCH request to partially update data at the specified path.
 * @async
 * @param {string} [path=""] - The endpoint path for the partial update.
 * @param {Object} [data={}] - The data to be sent in the request body.
 * @returns {Promise<Object>} The JSON response from the server.
 * @function patchData
 */
async function patchData(path = '', data = {}) {
  let response = await fetch(BASE_URL + path + '.json', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}
