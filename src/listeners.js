import { ipcMain } from 'electron'
import * as path from 'path'
import * as crypto from 'crypto'
import * as fs from 'fs'

function CalculateHash(algorithm, filepath) {
  return new Promise((resolve, reject) => {
    console.log(`Calculating ${algorithm}`)
    // get algorithm
    const sum = crypto.createHash(algorithm)
    // update sum with file content
    const start = process.hrtime()
    const stream = fs.createReadStream(path.resolve(filepath))
    stream.on('data', (data) => { sum.update(data) })
    // make digest
    stream.on('end', () => {
      console.log(`Done Calculating ${algorithm}`)
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
      })
  })
}