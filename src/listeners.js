import { ipcMain } from 'electron'
import { resolve as resolvePath } from 'path'
import { createHash } from 'crypto'
import { createReadStream } from 'fs'

function CalculateHash(algorithm, filepath) {
  return new Promise((resolve, reject) => {
    // get algorithm
    const sum = createHash(algorithm)
    // update sum with file content
    const start = process.hrtime()
    const stream = createReadStream(resolvePath(filepath))
    stream.on("error", (e) => { reject(e) })
    stream.on('data', (data) => { sum.update(data) })
    // make digest
    stream.on('end', () => {
      resolve({
        algorithm,
        hash: sum.digest('hex'),
        computeTime: process.hrtime(start)[0],
      })
    })
  })
}

export function StartListeners() {
  ipcMain.on("hash:start", (e, algorithms, filepath) => {
    const promises = [];
    // create a promise for each algorithm
    algorithms.forEach((algorithm) => {
      promises.push(CalculateHash(algorithm, filepath))
    });
    // run promises in parallel
    Promise.all(promises)
      .then((digests) => {
        e.sender.send("hash:done", digests)
      }).catch((err) => {
        e.sender.send("hash:error", err)
      })
  })
}
