/** 
 * RECOMMENDATION
 * 
 * To test your code, you should open "tester.html" in a web browser.
 * You can then use the "Developer Tools" to see the JavaScript console.
 * There, you will see the results unit test execution. You are welcome
 * to run the code any way you like, but this is similar to how we will
 * run your code submission.
 * 
 * The Developer Tools in Chrome are available under the "..." menu, 
 * futher hidden under the option "More Tools." In Firefox, they are 
 * under the hamburger (three horizontal lines), also hidden under "More Tools." 
 */

/**
 * Searches for matches in scanned text.
 * @param {string} searchTerm - The word or term we're searching for. 
 * @param {JSON} scannedTextObj - A JSON object representing the scanned text.
 * @returns {JSON} - Search results.
 * */ 
function findSearchTermInBooks(searchTerm, scannedTextObj) {
    /** You will need to implement your search and 
     * return the appropriate object here. */

    var result = {
        "SearchTerm": searchTerm,
        "Results": []
    };

    // If empty/null search term or null scannedTextObj, return empty search results (would typically display error)
    if (!searchTerm || !scannedTextObj) {
        return result; 
    }

    for (let book of scannedTextObj) {
        for (let i = 0; i < book.Content.length; i++) {
            if (checkForSearchTermStartingAtLine(i, book.Content, searchTerm, true)) {
                let line = book.Content[i]; 
                let res = {
                    "ISBN": book.ISBN, 
                    "Page": line.Page,
                    "Line": line.Line 
                }
                result.Results.push(res); 
            }
        }
    }
    return result; 
}

/**
 * Searches for a match starting at a particular line in a book. If the match continues over multiple lines,
 * this function will return true if a complete match was found that starts at the starting line. 
 * @param {number} lineNumber - The line number to look for a match on 
 * @param {JSON} content - Content of a book 
 * @param {string} searchTerm - The part of the search term we are looking for a match for on this line
 * @param {boolean} isStartingLine - true if we are starting the search on this line, false if we are continuing the search from a prev line
 * @returns {boolean} - true if a valid match with the searchTerm starts on this line, false otherwise 
 * */ 
function checkForSearchTermStartingAtLine(lineNumber, content, searchTerm, isStartingLine) {
    // Base case, if no more lines to search, means there is no match 
    if (lineNumber >= content.length) {
        return false; 
    }
    let line = content[lineNumber].Text; 
    
    // If this is the first line we are starting to search in we have to do extra checks because the 
    // search term could start at any point in the first line 
    if (isStartingLine) {
        // If there is complete match in this line, return true 
        if (line.includes(searchTerm)) {
            return true; 
        }
        // If not complete match, must check to see if this line starts a match that continues onto other lines. 
        for (let i = searchTerm.length - 1; i >= 0; i--) {
            let searchTermSubstring = searchTerm.substring(0, i);
            let lineEndsInDash = line[line.length - 1] === '-'; 
            let validIndexOfMatch = line.indexOf(searchTermSubstring) === (line.length - searchTermSubstring.length); 
            let validIndexOfMatchIgnoringDash = lineEndsInDash && line.substring(0, line.length - 1).indexOf(searchTermSubstring) === (line.length - 1 - searchTermSubstring.length); 
            if (validIndexOfMatch || validIndexOfMatchIgnoringDash) {
                if (checkForSearchTermStartingAtLine(lineNumber + 1, content, searchTerm.substring(i).trim(), true)) {
                    return true; 
                }
            }   
        }
        return false; 
    } else {
        // If this is not the starting line, then the remaining part of the searchTerm to match must start at the beginning of the line 
        // and either be match completely on this line, or continue onto the next line 
        let i = 0;
        // Stop if a complete match has been found or one character before end of line to handle the special case with '-' 
        for (i; i < line.length - 1 && i <searchTerm.length; i++) {
            if (line[i] !== searchTerm[i]) {
                return false; 
            }
        }
        // We found a match on this line so return true 
        if (i === searchTerm.length) {
            return true; 
        }
        // Check last character in line, if it doesn't match and last character isn't a '-', return false, otherwise, 
        // we assume the match could continue onto next line due to a word break 
        if (line[i] !== searchTerm[i] && searchTerm[i] !== '-') {
            return false; 
        } 
        // Check next line with the remaining part of searchTerm to match 
        return checkForSearchTermStartingAtLine(lineNumber + 1, content, searchTerm.substring(i + 1).trim(), continued); 
    }
}

/*

    TEST DATA
                                                      
 */

/** Example input object. */
const twentyLeaguesIn = [
    {
        "Title": "Twenty Thousand Leagues Under the Sea",
        "ISBN": "9780000528531",
        "Content": [
            {
                "Page": 31,
                "Line": 8,
                "Text": "now simply went on by her own momentum.  The dark-"
            },
            {
                "Page": 31,
                "Line": 9,
                "Text": "ness was then profound; and however good the Canadian\'s"
            },
            {
                "Page": 31,
                "Line": 10,
                "Text": "eyes were, I asked myself how he had managed to see, and"
            } 
        ] 
    }
]
    
/** Example output object */
const twentyLeaguesOut = {
    "SearchTerm": "the",
    "Results": [
        {
            "ISBN": "9780000528531",
            "Page": 31,
            "Line": 9
        }
    ]
}

/** 
 * Test Book One
 * - Contains words separated onto multiples line 
 * - Contains special character \' 
 * - Contains characters with different casing 
 */
const testBookOne = 
    {
        "Title": "Test Book",
        "ISBN": "0",
        "Content": [
            {
                "Page": 1,
                "Line": 1,
                "Text": "Once upon a time. There was a developer name-"
            },
            {
                "Page": 1,
                "Line": 2,
                "Text": "d Sam who loved the intersection of technology, law, and sociology. He\'-"
            },
            {
                "Page": 1,
                "Line": 3,
                "Text": "s really interested in public interest technology and found a"
            },
            {
                "Page": 1,
                "Line": 4,
                "Text": "fellowship through to work at the US government called the USDC"
            },
            {
                "Page": 2,
                "Line": 1,
                "Text": "that he really hopes he gets! He is nervous to check-"
            },
            {
                "Page": 2,
                "Line": 2,
                "Text": "in his code and hopes it works!"
            }
        ] 
    }

/** 
 * Test Book Two
 * - Contains repeating phrases over multiple lines
 */
const testBookTwo = 
    {
        "Title": "Test Book Two",
        "ISBN": "1",
        "Content": [
            {
                "Page": 1,
                "Line": 1,
                "Text": "I hope you are ha"
            },
            {
                "Page": 1,
                "Line": 2,
                "Text": "ving a lovely day :) I ho"
            },
            {
                "Page": 1,
                "Line": 3,
                "Text": "pe you are having a lovely day :) I"
            },
            {
                "Page": 1,
                "Line": 4,
                "Text": "hope you are having a lovely day :"
            },
            {
                "Page": 2,
                "Line": 1,
                "Text": ") I hope you are having a lovely day :)"
            },
            {
                "Page": 2,
                "Line": 2,
                "Text": "I hope you are havin"
            }
        ] 
    }


/** 
 * Book Test Two
 * - An empty book 
 */
const emptyBook = [
    {
        "Title": "Empty Book",
        "ISBN": "1",
        "Content": [] 
    }
]

/*
 _   _ _   _ ___ _____   _____ _____ ____ _____ ____  
| | | | \ | |_ _|_   _| |_   _| ____/ ___|_   _/ ___| 
| | | |  \| || |  | |     | | |  _| \___ \ | | \___ \ 
| |_| | |\  || |  | |     | | | |___ ___) || |  ___) |
 \___/|_| \_|___| |_|     |_| |_____|____/ |_| |____/ 
                                                      
 */

/* We have provided two unit tests. They're really just `if` statements that 
 * output to the console. We've provided two tests as examples, and 
 * they should pass with a correct implementation of `findSearchTermInBooks`. 
 * 
 * Please add your unit tests below.
 * */

/** We can check that, given a known input, we get a known output. */
const test1result = findSearchTermInBooks("the", twentyLeaguesIn);
if (JSON.stringify(twentyLeaguesOut) === JSON.stringify(test1result)) {
    console.log("PASS: Test 1");
} else {
    console.log("FAIL: Test 1");
    console.log("Expected:", twentyLeaguesOut);
    console.log("Received:", test1result);
}

/** We could choose to check that we get the right number of results. */
const test2result = findSearchTermInBooks("the", twentyLeaguesIn); 
if (test2result.Results.length == 1) {
    console.log("PASS: Test 2");
} else {
    console.log("FAIL: Test 2");
    console.log("Expected:", twentyLeaguesOut.Results.length);
    console.log("Received:", test2result.Results.length);
}


// Multiple lines w/special character 
const test3result = findSearchTermInBooks("logy. He's really interested in public interest technology", [testBookOne]);
const test3out = {
    "SearchTerm": "logy. He's really interested in public interest technology",
    "Results": [
        {
            "ISBN": "0",
            "Page": 1,
            "Line": 2
        }
    ]
}
if (JSON.stringify(test3out) === JSON.stringify(test3result)) {
    console.log("PASS: Test 3");
} else {
    console.log("FAIL: Test 3");
    console.log("Expected:", test3out);
    console.log("Received:", test3result);
}


// Multiple lines (the whole book)
const test4result = findSearchTermInBooks("Once upon a time. There was a developer named Sam who loved the intersection of " +
                        "technology, law, and sociology. He\'s really interested in public interest technology and found a " +
                        "fellowship through to work at the US government called the USDC that he really hopes he gets!", [testBookOne]); 
const test4out = {
    "SearchTerm": "Once upon a time. There was a developer named Sam who loved the intersection of " +
        "technology, law, and sociology. He\'s really interested in public interest technology and found a " +
        "fellowship through to work at the US government called the USDC that he really hopes he gets!",
    "Results": [
        {
            "ISBN": "0",
            "Page": 1,
            "Line": 1
        }
    ]
}
if (JSON.stringify(test4out) === JSON.stringify(test4result)) {
    console.log("PASS: Test 4");
} else {
    console.log("FAIL: Test 4");
    console.log("Expected:", test4out);
    console.log("Received:", test4result);
}

// Search for part of a hyphenated work 
const test5result = findSearchTermInBooks("ck-in his code", [testBookOne]); 
const test5out = {
    "SearchTerm": "ck-in his code",
    "Results": [
        {
            "ISBN": "0",
            "Page": 2,
            "Line": 1
        }
    ]
}
if (JSON.stringify(test5out) === JSON.stringify(test5result)) {
    console.log("PASS: Test 5");
} else {
    console.log("FAIL: Test 5");
    console.log("Expected:", test5out);
    console.log("Received:", test5result);
}

// Search phrase repeated over many lines 
const test6result = findSearchTermInBooks("having", [testBookTwo]); 
const test6out = {
    "SearchTerm": "having",
    "Results": [
        {
            "ISBN": "1",
            "Page": 1,
            "Line": 1
        }, 
        {
            "ISBN": "1",
            "Page": 1,
            "Line": 3
        },
        {
            "ISBN": "1",
            "Page": 1,
            "Line": 4
        },
        {
            "ISBN": "1",
            "Page": 2,
            "Line": 1
        }
    ]
}
if (JSON.stringify(test6out) === JSON.stringify(test6result)) {
    console.log("PASS: Test 6");
} else {
    console.log("FAIL: Test 6");
    console.log("Expected:", test6out);
    console.log("Received:", test6result);
}

// Matching text in one book but not the other 
const test7result = findSearchTermInBooks("having", [testBookOne, testBookTwo]); 
const test7out = test6out; 
if (JSON.stringify(test7out) === JSON.stringify(test7result)) {
    console.log("PASS: Test 7");
} else {
    console.log("FAIL: Test 7");
    console.log("Expected:", test7out);
    console.log("Received:", test7result);
}

// Incomplete match on last line (trailing whitespace in search term but line ends in book)
const test8result = findSearchTermInBooks("it works! ", [testBookOne]); 
const test8out = {
    "SearchTerm": "it works! ",
    "Results": []
};
if (JSON.stringify(test8out) === JSON.stringify(test8result)) {
    console.log("PASS: Test 8");
} else {
    console.log("FAIL: Test 8");
    console.log("Expected:", test8out);
    console.log("Received:", test8result);
}

// Doesn't match last character middle of single line 
const test9result = findSearchTermInBooks("veloz", [testBookOne]); 
const test9out = {
    "SearchTerm": "veloz",
    "Results": []
};
if (JSON.stringify(test9out) === JSON.stringify(test9result)) {
    console.log("PASS: Test 9");
} else {
    console.log("FAIL: Test 9");
    console.log("Expected:", test9out);
    console.log("Received:", test9result);
}

// Doesn't match last character multi-line end of line 
const test10result = findSearchTermInBooks("hnology and found a fellowship through to work at the US government called the USDD", [testBookOne]); 
const test10out = {
    "SearchTerm": "hnology and found a fellowship through to work at the US government called the USDD",
    "Results": []
};
if (JSON.stringify(test10out) === JSON.stringify(test10result)) {
    console.log("PASS: Test 10");
} else {
    console.log("FAIL: Test 10");
    console.log("Expected:", test10out);
    console.log("Received:", test10result);
}
        
// Empty search term
const test11result = findSearchTermInBooks("", [testBookOne]); 
const test11out = {
    "SearchTerm": "",
    "Results": []
};
if (JSON.stringify(test11out) === JSON.stringify(test11result)) {
    console.log("PASS: Test 11");
} else {
    console.log("FAIL: Test 11");
    console.log("Expected:", test11out);
    console.log("Received:", test11result);
}

// Null search term
const test12result = findSearchTermInBooks(null, [testBookOne]); 
const test12out = {
    "SearchTerm": null,
    "Results": []
};
if (JSON.stringify(test12out) === JSON.stringify(test12result)) {
    console.log("PASS: Test 12");
} else {
    console.log("FAIL: Test 12");
    console.log("Expected:", test12out);
    console.log("Received:", test12result);
}

// Null scanned text term
const test13result = findSearchTermInBooks("null", null); 
const test13out = {
    "SearchTerm": "null",
    "Results": []
};
if (JSON.stringify(test13out) === JSON.stringify(test13result)) {
    console.log("PASS: Test 13");
} else {
    console.log("FAIL: Test 13");
    console.log("Expected:", test13out);
    console.log("Received:", test13result);
}