/**
 * Calculates the download statistics including average speed and progress percentage.
 *
 * @param {number} start - The timestamp when the download started.
 * @param {number} loaded - The number of bytes downloaded so far.
 * @param {number} total - The total size of the resource in bytes.
 * @returns {Object} An object containing average speed in Mbps and progress percentage.
 */
function getDownloadStats(start, loaded, total) {
  const now = Date.now();
  const diff = (now - start) / 1000;
  const bps = loaded / diff;
  const average = (bps / 1024 / 1024) * 8;
  const progress = (loaded / total) * 100.0;

  return { average, progress };
}

/**
 * Downloads a file from the specified URL and provides download progress through a callback function.
 *
 * @param {string} url - The URL of the file to be downloaded.
 * @param {function} callback - A callback function to receive download progress (average speed, progress percentage).
 * @returns {Promise<boolean>} A Promise that resolves to `true` when the download is complete, or rejects with an error.
 * @throws {Error} If a network error occurs while trying to download the file.
 */
export function testDownload(url, callback) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    const start = Date.now();

    request.addEventListener("progress", (event) => {
      const { average, progress } = getDownloadStats(
        start,
        event.loaded,
        event.total
      );

      callback(average, progress);
    });

    request.addEventListener("load", () => {
      resolve(true);
    });

    request.addEventListener("error", () => {
      reject(
        new Error("Network error occurred while trying to download the file.")
      );
    });

    request.open("GET", url, true);
    request.responseType = "blob";
    request.send();
  });
}
