import { ipcRenderer } from 'electron'

const StartCalculatingHash = (algorithms, file) => {
  const loading = document.getElementById("loading")

  function DoneHashHandler(e, digests) {
    loading.hide()

    DisplayHashes(digests, file)
  }

  loading.show()
  ipcRenderer.send("hash:start", algorithms, file.path)
  ipcRenderer.once("hash:done", DoneHashHandler)
}
