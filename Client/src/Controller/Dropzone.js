let Body = document.querySelector('body')

let Dropzone = uploader => {
    console.log(Body)
    if (!Body) return
    if (Body.getAttribute('listener') === 'true') return

    ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop']
        .forEach(e => Body.addEventListener(e, event => {
            event.preventDefault()
            event.stopPropagation()
        }))

    let handleDragOver = _ => Body.classList.add('dragover')
    let handleDragLeave = _ => Body.classList.remove('dragover')
    let handleDrop = e => {
        handleDragLeave()

        let droppedFiles = e?.dataTransfer?.files

        if (droppedFiles) uploader(droppedFiles)
    }

    Body.addEventListener('dragover', handleDragOver)
    Body.addEventListener('dragenter', handleDragOver)

    Body.addEventListener('dragleave', handleDragLeave)
    Body.addEventListener('dragend', handleDragLeave)

    Body.addEventListener('drop', handleDrop)

    Body.setAttribute('listener', 'true')
}

export default Dropzone