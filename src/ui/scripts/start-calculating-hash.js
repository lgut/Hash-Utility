import { ipcRenderer } from 'electron'

const StartCalculatingHash = (algorithms, file) => {
  const loading = document.getElementById("loading")

  function DoneHashHandler(e, digests) {
    loading.hide()

    DisplayHashes(digests, file)
  }
  function ErrorHandler(error) {
    const warningMessage = document.getElementById("hash-error")
    loading.hide()
    ListenForFile()
    warningMessage.slidedown()
  }

  loading.show()
  ipcRenderer.send("hash:start", algorithms, file.path)
  ipcRenderer.once("hash:done", DoneHashHandler)
  ipcRenderer.once("hash:error", ErrorHandler)
}
