// Lenient merge stub: skips invalid NDJSON lines so reporting doesn't break on bad JSON.
const fs = require('fs/promises');

function safeParseLines(content) {
  return content
    .toString()
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .reduce((acc, line) => {
      try {
        acc.push(JSON.parse(line));
      } catch {
        // Ignore malformed lines
      }
      return acc;
    }, []);
}

function mergeMessages(messagesCols) {
  return messagesCols.flat();
}

async function mergeMessagesFiles(files) {
  const contents = await Promise.all(files.map((file) => fs.readFile(file)));
  const merged = mergeMessages(contents.map((c) => safeParseLines(c)));
  return merged.map((message) => JSON.stringify(message)).join('\n');
}

async function mergeMessagesArgs(options) {
  const [, , ...files] = options.argv;
  options.stdout.write(await mergeMessagesFiles(files));
}

module.exports = {
  mergeMessages,
  mergeMessagesFiles,
  mergeMessagesArgs,
};
