const axios = require('axios');

let resp;
const url = 'http://res.cloudinary.com/dzbqhaluy/raw/upload/v1527837362/profane_wordsV3.json';


module.exports.getDict = async function getDict() {
  return new Promise(async (resolve, reject) => {
    resp = await axios.get(url);
    const dicVal = await resp.data;
    if (dicVal) resolve(dicVal);
    else reject();
  });
};
