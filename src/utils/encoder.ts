const plantumlEncoder = require("plantuml-encoder");

/**
 * Encode the markdown text to a plantuml encoded string (base64 similar to plantuml.com)
 * @see https://plantuml.com/text-encoding
 * @param content The markdown content to encode
 * @returns 
 */
function encode(content: string) {
    return plantumlEncoder.encode(content);
}

/**
 * Decode base64 encoded plantuml content to source markdown text.
 * @see https://plantuml.com/text-encoding
 * @param content the encoded content in base64
 * @returns 
 */
function decode(content: string) {
    return plantumlEncoder.decode(content);
}

export { encode, decode };