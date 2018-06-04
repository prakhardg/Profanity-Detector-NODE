let run = require('./primary.js');

module.exports.hasProfanity = function hasProfanity(sentence_to_check){
return new Promise ((resolve,reject) => {
	run.isProfane(sentence_to_check)
    .then((answer) => { resolve(answer) })
	.catch(() => { reject("Error"); });
}).then((ans) =>{return ans;}).catch(()=>{return Error('Could not use the package');}); 
};