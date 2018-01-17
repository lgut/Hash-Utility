import { clipboard } from 'electron'
const DisplayHashes = (digests, file) => {
  const done = document.getElementById("done")
  const copySuccess = document.getElementById("copy-success")
  const filenameDisplay = document.getElementById('filename')
  const compareForm = document.getElementById("compare")
  const startover = document.getElementById("start-over")
  // gets all the fields where calculated hashes will be output
  const hashFields = Array.from(document.querySelectorAll("#done .hash-field"))
    .filter((field) => {
      return digests.some((digest) => {
        return digest.algorithm === field.dataset.algorithm
      })
    })

  function ShowFields() {
    hashFields.forEach((field) => {
      field.show()
    })
  }
  function HideFields() {
    hashFields.forEach((field) => {
      field.hide()
    })
  }
  function DisplayFileName() {
    filenameDisplay.innerText = file.name
  }
  function PopulateTextFields() {
    hashFields.forEach((field) => {
      const digest = digests.find((d) => {
        return field.dataset.algorithm === d.algorithm
      })
      field.firstElementChild.value = digest.hash
    })
  }
  function DepopulateTextFields() {
    hashFields.forEach((field) => {
      field.firstElementChild.value = ""
    })
    compareForm.elements.userHash.value = ""
  }

  // copys text to the users clipboard an displays amessage
  function CopyClickHandler(e) {
    const content = this.parentElement.firstElementChild.value
    clipboard.writeText(content)
    copySuccess.slidedown()
  }
  function InitCopyClickHandlers() {
    hashFields.forEach((field) => {
      field.lastElementChild.addEventListener("click", CopyClickHandler, false)
    })
  }
  function RemoveCopyClickHandlers() {
    hashFields.forEach((field) => {
      field.lastElementChild.removeEventListener("click", CopyClickHandler, false)
    })
  }
  function CompareHashes(e) {
    e.preventDefault()
    const userhash = e.target.elements.userHash.value;
    const notice = document.getElementById("match")
    const match = digests.find((d) => {
      return d.hash === userhash
    })
    if (match) {
      notice.innerText = `${match.algorithm.toUpperCase()} matched!`
      notice.slidedown()
    } else {
      notice.innerText = `No match!`
      notice.slidedown()
    }
  }
  function PasteHandler(e) {
    const userHash = e.target.form.elements.userHash
    userHash.value = clipboard.readText()
  }
  function StartCompareHandling() {
    compareForm.addEventListener('submit', CompareHashes, false)
    compareForm.elements.paste.addEventListener('click', PasteHandler, false)
  }
  function StopCompareHandling() {
    compareForm.removeEventListener('submit', CompareHashes, false)
    compareForm.elements.paste.removeEventListener('click', PasteHandler, false)
  }
  function StartOver(e) {
    done.hide()
    HideFields()
    DepopulateTextFields()
    RemoveCopyClickHandlers()
    StopCompareHandling()
    ListenForFile()
    this.removeEventListener('click', StartOver, false)
  }

  done.show()
  ShowFields()
  DisplayFileName()
  PopulateTextFields()
  InitCopyClickHandlers()
  StartCompareHandling()
  startover.addEventListener('click', StartOver, false)
}
