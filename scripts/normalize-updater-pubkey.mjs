function decodeBase64(value) {
  try {
    return Buffer.from(value, "base64").toString("utf8");
  } catch {
    return "";
  }
}

function extractRwLine(value) {
  const normalized = value.replace(/\r/g, "");
  const lines = normalized
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const direct = lines.find((line) => /^RW[A-Za-z0-9+/=]+$/.test(line));
  if (direct) return direct;

  const decoded = decodeBase64(normalized.trim());
  if (decoded) {
    const decodedLines = decoded
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const fromDecoded = decodedLines.find((line) => /^RW[A-Za-z0-9+/=]+$/.test(line));
    if (fromDecoded) return fromDecoded;
  }

  return "";
}

const input = process.argv[2] ?? "";
const output = extractRwLine(input);

if (!output) {
  console.error(
    "Invalid updater public key. Expected a minisign public key line starting with 'RW...'."
  );
  process.exit(1);
}

process.stdout.write(output);
