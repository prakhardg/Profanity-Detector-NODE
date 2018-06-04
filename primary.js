'use strict';
let PorterStemmer = require('./stemmer.js');
let Dictionary = require('./Dict.js');

module.exports.isProfane = async function isProfane(sentence) {
    let profane = false;            // Flag variable which checks for profanity of the content.
    let N = 1;
    const inputSize = sentence.split().length;
    let profaneDictionary;
    await Dictionary.getDict().then((dictionary) => { profaneDictionary = dictionary; });
    if (profaneDictionary) {
        while (N <= Math.min(4, inputSize)) {
            let ngrams = Array.from(getNgrams(sentence.toLowerCase(), N));   //Converting set of ngrams into array
            for (let i = 0; i < ngrams.length && !profane; i++) {
                profane = profaneDictionary.hasOwnProperty(PorterStemmer.stem(ngrams[i]));
            }
            N++;
        }
    }

    return profane;
}

function getNgrams(sentence, N) {
    let words = sentence.split(/\s|\.|\?|\-|,|#|\!/g); // [\\s\\-\\.\\'\\?\\,\\_\\@\\!]+
    let nGramSet = new Set();
    let len = words.length;

    for (let currentIndex = 0; currentIndex <= len - N; currentIndex++) {
        let stringBuilder = words[currentIndex];
        for (let next = currentIndex + 1; next - currentIndex < N; next++) {
            stringBuilder += "_" + words[next];
        }
        var nGramSetValue = stringBuilder;
        nGramSet.add(nGramSetValue);
    }
    return nGramSet;
}