function lexer(input) {
    var current = null;
    var keywords = " if then else toy true false ";
    return {
        next: next,
        peek: peek,
        eof: eof,
        croak: input.croak
    }

    function isKeyword(x) {
        return keywords.indexOf(" " + x + " ") >= 0;
    }
    function isDigit(char) {
        return /[0-9]/i.test(char)
    }
    function isIdStart(char) {
        return /[a-z_]/i.test(char)
    }
    function isId(char) {
        return isIdStart(char) || "?!-=123456789".indexOf(char) >= 0;
    }
    function isOperator(char) {
        return "+-*/%=&|<>!".indexOf(char) >= 0;
    }
    function isPunctuation(char) {
        return ",;(){}[]".indexOf(char) >= 0;
    }
    function isWhitespace(char) {
        return " \t\n".indexOf(char) >= 0;
    }
    function readWhile(predicate) {
        var str = "";
        while (!input.eof() && predicate(input.peek()))
            str += input.next();
        return str;
    }
    function readNumber() {
        var hasDot = false
        var number = readWhile(function(char) {
            if (char == ".") {
                if (hasDot) return false;
                hasDot = true;
                return true;
            }
            return isDigit(char)
        });
        return { type: "num", value: parseFloat(number) };
    }
    function readId() {
        var id = readWhile(isId);
        return { type: isKeyword(id) ? "kw" : "var", value: id}
    }
    function readEscaped(end) {
        var escaped = false, str = "";
        input.next();
        while (!input.eof()) {
            var char = input.next();
            if (escaped) {
                str += char;
                escaped = false;
            } else if (char == "\\") {
                escaped = true;
            } else if (char == end) {
                break;
            } else {
                str += char
            }
        }
    }
    function readString() {
        return { type: "str", value: readEscaped('"' )};
    }
    function skipComment() {
        readWhile(function(char) {return char != "\n"});
        input.next();
    }
    function readNext() {
        readWhile(isWhitespace);
        if (input.eof()) return null

        var char = input.peek();
        if (char == "#") {
            skipComment();
            return readNext();
        }

        if (char == '"') return readString();
        if (isDigit(char)) return readNumber();
        if (isIdStart(char)) return readId();
        if (isPunctuation(char)) return {
            type: "punc",
            value: input.next()
        };
        if (isOperator(char)) return {
            type: "op",
            value: readWhile(isOperator)
        };
        input.croak("Can't handle character: " + char)
    }
    function peek() {
        return current || (current = readNext());
    }
    function next() {
        var token = current;
        current = null;
        return token || readNext();
    }
    function eof() {
        return peek() == null;
    }
}