/**
 * This script uses Porter stemmer logic which is used to stem the words and Ngrams created from the user input.
 * Then we can search if the stem word is present as a key in profaneDict which is loaded from the CDN
 * stemmer('string')
 * return type = string
 */
let stem = (function stem() {
    let step2list = {
        "ational": "ate",
        "tional": "tion",
        "enci": "ence",
        "anci": "ance",
        "izer": "ize",
        "bli": "ble",
        "alli": "al",
        "entli": "ent",
        "eli": "e",
        "ousli": "ous",
        "ization": "ize",
        "ation": "ate",
        "ator": "ate",
        "alism": "al",
        "iveness": "ive",
        "fulness": "ful",
        "ousness": "ous",
        "aliti": "al",
        "iviti": "ive",
        "biliti": "ble",
        "logi": "log"
    },

        step3list = {
            "icate": "ic",
            "ative": "",
            "alize": "al",
            "iciti": "ic",
            "ical": "ic",
            "ful": "",
            "ness": ""
        },

        consonant = "[^aeiou]",          // consonant
        vowel = "[aeiouy]",          // vowel
        consonant_seq = consonant + "[^aeiouy]*",    // consonant sequence
        vowel_seq = vowel + "[aeiou]*",      // vowel sequence

        mgr0 = "^(" + consonant_seq + ")?" + vowel_seq + consonant_seq,               // [consonant_seq]VC... is m>0
        meq1 = "^(" + consonant_seq + ")?" + vowel_seq + consonant_seq + "(" + vowel_seq + ")?$",  // [consonant_seq]VC[vowel_seq] is m=1
        mgr1 = "^(" + consonant_seq + ")?" + vowel_seq + consonant_seq + vowel_seq + consonant_seq,       // [consonant_seq]VCVC... is m>1
        s_v = "^(" + consonant_seq + ")?" + vowel;                   // vowel in stem

    return function (word) {
        let stem,
            suffix,
            firstch,
            re,
            re2,
            re3,
            re4,
            origword = word;

        if (word.length < 3) { return word; }

        firstch = word.substr(0, 1);
        if (firstch == "y") {
            word = firstch.toUpperCase() + word.substr(1);
        }

        // Step 1a
        re = /^(.+?)(ss|i)es$/;
        re2 = /^(.+?)([^s])s$/;

        if (re.test(word)) { word = word.replace(re, "$1$2"); }
        else if (re2.test(word)) { word = word.replace(re2, "$1$2"); }

        // Step 1b
        re = /^(.+?)eed$/;
        re2 = /^(.+?)(ed|ing)$/;
        if (re.test(word)) {
            let found_patterns = re.exec(word);
            re = new RegExp(mgr0);
            if (re.test(found_patterns[1])) {
                re = /.$/;
                word = word.replace(re, "");
            }
        } else if (re2.test(word)) {
            let found_patterns = re2.exec(word);
            stem = found_patterns[1];
            re2 = new RegExp(s_v);
            if (re2.test(stem)) {
                word = stem;
                re2 = /(at|bl|iz)$/;
                re3 = new RegExp("([^aeiouylsz])\\1$");
                re4 = new RegExp("^" + consonant_seq + vowel + "[^aeiouwxy]$");
                if (re2.test(word)) { word = word + "e"; }
                else if (re3.test(word)) { re = /.$/; word = word.replace(re, ""); }
                else if (re4.test(word)) { word = word + "e"; }
            }
        }

        // Step 1c
        re = /^(.+?)y$/;
        if (re.test(word)) {
            let found_patterns = re.exec(word);
            stem = found_patterns[1];
            re = new RegExp(s_v);
            if (re.test(stem)) { word = stem + "i"; }
        }

        // Step 2
        re = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;
        if (re.test(word)) {
            let found_patterns = re.exec(word);
            stem = found_patterns[1];
            suffix = found_patterns[2];
            re = new RegExp(mgr0);
            if (re.test(stem)) {
                word = stem + step2list[suffix];
            }
        }

        // Step 3
        re = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;
        if (re.test(word)) {
            let found_patterns = re.exec(word);
            stem = found_patterns[1];
            suffix = found_patterns[2];
            re = new RegExp(mgr0);
            if (re.test(stem)) {
                word = stem + step3list[suffix];
            }
        }

        // Step 4
        re = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;
        re2 = /^(.+?)(s|t)(ion)$/;
        if (re.test(word)) {
            let found_patterns = re.exec(word);
            stem = found_patterns[1];
            re = new RegExp(mgr1);
            if (re.test(stem)) {
                word = stem;
            }
        } else if (re2.test(word)) {
            let found_patterns = re2.exec(word);
            stem = found_patterns[1] + found_patterns[2];
            re2 = new RegExp(mgr1);
            if (re2.test(stem)) {
                word = stem;
            }
        }

        // Step 5
        re = /^(.+?)e$/;
        if (re.test(word)) {
            let found_patterns = re.exec(word);
            stem = found_patterns[1];
            re = new RegExp(mgr1);
            re2 = new RegExp(meq1);
            re3 = new RegExp("^" + consonant_seq + vowel + "[^aeiouwxy]$");
            if (re.test(stem) || (re2.test(stem) && !(re3.test(stem)))) {
                word = stem;
            }
        }

        re = /ll$/;
        re2 = new RegExp(mgr1);
        if (re.test(word) && re2.test(word)) {
            re = /.$/;
            word = word.replace(re, "");
        }

        // and turn initial Y back to y

        if (firstch == "y") {
            word = firstch.toLowerCase() + word.substr(1);
        }

        return word;
    }
})();

module.exports = {
    stem
};
