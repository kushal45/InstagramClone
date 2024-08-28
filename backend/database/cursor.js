const zlib = require("zlib");

class Cursor {
  static encode(data) {
    if (!data) {
      return null;
    }
    const stringifiedData = JSON.stringify(
     {
      id: data.id,
     }
    );
    // You could use Buffer, base64, or any other encoding mechanism
    const bufferData = Buffer.from(stringifiedData);
    const compressedData64 = zlib
      .deflateSync(bufferData)
      .toString("base64")
      .replace(/=+$/, "");
    console.log("compressedData", compressedData64);
    return compressedData64;
  }

  static decode(cursor) {
    const decodedString = zlib
      .inflateSync(Buffer.from(cursor, "base64"))
      .toString();
    try {
      return JSON.parse(decodedString);
    } catch (error) {
      throw new Error("Invalid cursor format");
    }
  }
}

module.exports = Cursor;
