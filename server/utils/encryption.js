const crypto = require("crypto");

const algorithm = "aes-256-cbc";

const secretKey = crypto
  .createHash("sha256")
  .update(process.env.ENCRYPTION_KEY)
  .digest();

const ivLength = 16;

exports.encrypt = (text) => {
  const iv = crypto.randomBytes(ivLength);

  const cipher = crypto.createCipheriv(
    algorithm,
    secretKey,
    iv
  );

  let encrypted = cipher.update(
    text,
    "utf8",
    "hex"
  );

  encrypted += cipher.final("hex");

  return `${iv.toString("hex")}:${encrypted}`;
};

exports.decrypt = (encryptedText) => {
  const parts = encryptedText.split(":");

  const iv = Buffer.from(parts[0], "hex");

  const encrypted = parts[1];

  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    iv
  );

  let decrypted = decipher.update(
    encrypted,
    "hex",
    "utf8"
  );

  decrypted += decipher.final("utf8");

  return decrypted;
};
