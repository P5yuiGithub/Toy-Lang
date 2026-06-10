function InputStream(input) {
    var pos = 0, line = 1, col = 0;
    return {
        next: next,
        peek: peek,
        eof: eof,
        croak: croak
    };
    function next() {
        var char = input.charAt(pos++);
        if (char == "\n") line++, col = 0; else col++;
        return char;
    }
    function peek() {
        return input.charAt(pos);
    }
    function eof() {
        return peek() == "";
    }
    function croak(msg) {
        throw new Error(msg + " " + line + ":" + col + ")")
    }
}