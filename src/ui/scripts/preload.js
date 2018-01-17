(function () {
  const HIDDENCLASS = "is-hidden"
  const BLURCLASS = "blur"
  HTMLElement.prototype.hide = function () {
    this.classList.add(HIDDENCLASS)
  }
  HTMLElement.prototype.show = function () {
    this.classList.remove(HIDDENCLASS)
  }
  HTMLElement.prototype.blur = function () {
    this.classList.add(BLURCLASS)
  }
  HTMLElement.prototype.unBlur = function () {
    this.classList.remove(BLURCLASS)
  }
  HTMLDivElement.prototype.slidedown = function () {
    this.classList.add("slidedown")
    setTimeout(() => {
      this.classList.remove("slidedown")
    }, 4000);
  }
}())
