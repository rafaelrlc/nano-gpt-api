const fs = require("fs/promises");
const path = require("path");

async function deleteAllFilesInDir(dirPath) {
  try {
    const files = await fs.readdir(dirPath);

    const deleteFilePromises = files.map((file) =>
      fs.unlink(path.join(dirPath, file))
    );

    await Promise.all(deleteFilePromises);
  } catch (err) {
    console.log(err);
  }
}

module.exports = { deleteAllFilesInDir };
