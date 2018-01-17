const ListenForFile = (function () {
  return () => {
    const body = document.getElementsByTagName('body')[0]
    const fileInput = document.getElementById('file-input')
    const fileForm = document.getElementById("algorithm-form")
    const overlay = document.getElementById("overlay")
    const content = document.getElementById("content")
    const algorithmWarning = document.getElementById("algorithm-warning")

    function HideOverlay() {
      overlay.hide()
      content.unBlur()
    }
    function showOverlay() {
      overlay.show()
      content.blur()
    }
    function FileDragHover(e) {
      e.stopPropagation()
      e.preventDefault()
      if (e.type == "dragover") {
        showOverlay()
      } else if (e.type == "drop") {
        HideOverlay()
      }
    }
    /**
   * 
   * @param {Event} e 
   */
    function FileSubmitHandler(e) {
      // cancel event and hover styling
      FileDragHover(e);

      // fetch FileList object
      const file = (e.target.files || e.dataTransfer.files)[0];

      // get selected algorithms
      const algorithms = Array.from(fileForm.elements)
        .filter((input) => {
          return input.id != "file-input" && input.checked === true
        })
        .map((input) => {
          return input.value
        })
        // checks if algorithms are selected
      if (algorithms.length > 0) {
        fileForm.hide()
        fileInput.removeEventListener("change", FileSubmitHandler, false)
        body.removeEventListener("dragover", FileDragHover, false)
        body.removeEventListener("dragleave", FileDragHover, false)
        body.removeEventListener("drop", FileSubmitHandler, false)
        overlay.removeEventListener("dragleave", HideOverlay, false)
        StartCalculatingHash(algorithms, file)
      } else {
        // warns user if no algorithms are selected
        algorithmWarning.slidedown()
      }
    }

    fileForm.show()
    fileInput.addEventListener("change", FileSubmitHandler, false)
    body.addEventListener("dragover", FileDragHover, false)
    body.addEventListener("dragleave", FileDragHover, false)
    body.addEventListener("drop", FileSubmitHandler, false)
    overlay.addEventListener("dragleave", HideOverlay, false)
  }
}())
