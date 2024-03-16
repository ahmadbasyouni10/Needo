// Types of tokens that can be found in the code when parsing
export enum TypeofToken {
    Number,
    Identifier, 
    Equals, 
    OpenParenthesis,
    CloseParenthesis,
    Operator,

    Let,
}

const NeedoKeywords = {
    "let": TypeofToken.Let,
}

// Structure of a token
export interface Token {
    value: string,
    type: TypeofToken,
}

function makeToken(value = "", type: TypeofToken): Token {
    return { value, type };
}

// Function to check if we encounter alphabetic character
function isAlphabetic(src: string) {
    return src.toUpperCase() != src.toLowerCase() 
}

function ignore (src: string) {
    return src === " " || src === "\n" || src === "\t";
}


// Function to check if we encounter numeric character
function isNumeric(src: string) {
    const j = src.charCodeAt(0);
    const zero = '0';
    const nine = '9';
    const asci1 = zero.charCodeAt(0);
    const asci2 = nine.charCodeAt(0);
    return (j >= asci1 && j <= asci2);
}


// Function to tokenize the source code (parse it into tokens)
// Parameter of sourcecode (type string) -> Returns an array of tokens
export function tokenize(sourceCode: string): Token[] {
    const tokens = new Array<Token>();
    const src = sourceCode.split(' ');
    // Loop through the source code until end of file and parse it into tokens
    while (src.length > 0) {
        if (src[0] === '(') {
            tokens.push(makeToken(src.shift(), TypeofToken.OpenParenthesis));
        }
        else if (src[0] === ')') {
            tokens.push(makeToken(src.shift(), TypeofToken.CloseParenthesis));
        }
        else if (src[0] === "+" || src[0] === "-" || src[0] === "*" || src[0] === "/") {
            tokens.push(makeToken(src.shift(), TypeofToken.Operator));
        }
        else if (src[0]=== "=") {
            tokens.push(makeToken(src.shift(), TypeofToken.Equals));
        }
        else {
            // Handles tokens with more than one character (e.g. numbers, identifiers)
            if (isNumeric(src[0])) {
                let number = "";
                while (src.length > 0 && isNumeric(src[0])) {
                    number += src.shift();
                }
                tokens.push(makeToken(number, TypeofToken.Number));

            } else if (isAlphabetic(src[0])) {
                let identf = "";
                while (src.length > 0 && (isAlphabetic(src[0]))) {
                    identf += src.shift();
                }

                // check if token is a keyword eg "let"
                if (NeedoKeywords[identf]) {
                    tokens.push(makeToken(identf, NeedoKeywords[identf]));
                }
                // check if token is any other identifier (e.g. variable name)
                else {
                    tokens.push(makeToken(identf, TypeofToken.Identifier));
                }
            }
            else if (ignore(src[0])) {
                src.shift();
            } else {
                console.log(`CAN'T IDENTIFY TOKEN ${src[0]}`)
                Deno.exit(1);

            }

        }
    }
    
    return tokens;
}