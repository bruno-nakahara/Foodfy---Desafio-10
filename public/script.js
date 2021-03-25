const cards = document.querySelectorAll('.card')
const status = document.querySelectorAll('.status')

const PhotosUpload = {
    input: "",
    preview: document.querySelector('#photos-preview'),
    uploadLimit: 0,
    files: [],

    handleFileInput(event, photosLimit) {
        const { files: fileList } = event.target
        PhotosUpload.input = event.target
        PhotosUpload.uploadLimit = photosLimit

        if (PhotosUpload.hasLimit(event)) return

        Array.from(fileList).forEach(file => {
            PhotosUpload.files.push(file)
            const reader = new FileReader()

            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const div = PhotosUpload.getContainer(image)

                PhotosUpload.preview.appendChild(div)
            }
            reader.readAsDataURL(file)
        })
        PhotosUpload.input.files = PhotosUpload.getAllFiles()
    },
    hasLimit(event) {
        const { uploadLimit, input, preview } = PhotosUpload
        const { files: fileList } = input

        if (fileList.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} fotos`)
            event.preventDefault()
            return true
        }

        const photosDiv = []
        preview.childNodes.forEach(item => {
            if (item.classList && item.classList.value == "photo") {
                photosDiv.push(item)
            }
        })

        const totalPhotos = fileList.length + photosDiv.length
        if (totalPhotos > uploadLimit) {
            alert("Você atingiu limite máximo de fotos!")
            event.preventDefault()
            return true
        }

        return false
    },
    getAllFiles() {
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files
    },
    getContainer(image) {
        const div = document.createElement('div')
        div.classList.add('photo')

        div.onclick = PhotosUpload.removePhoto

        div.appendChild(image)
        div.appendChild(PhotosUpload.getRemoveButton())

        return div
    },
    getRemoveButton() {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = "close"
        return button
    },
    removePhoto(event) {
        const photoDiv = event.target.parentNode
        const photosArray = Array.from(PhotosUpload.preview.children)
        const index = photosArray.indexOf(photoDiv)

        PhotosUpload.files.splice(index, 1)
        PhotosUpload.input.files = PhotosUpload.getAllFiles()

        photoDiv.remove()
    },
    removeOldPhoto(event) {
        const photoDiv = event.target.parentNode

        if (photoDiv.id) {
            const removedFiles = document.querySelector('input[name="removed_files"]')
            if (removedFiles) {
                removedFiles.value += `${photoDiv.id},`
            }
        }

        photoDiv.remove()
    }
}

const ImageGallery = {
    highlight: document.querySelector('.recipe-gallery .highlight > img'),
    previews: document.querySelectorAll('.gallery-preview img'),

    setImage(e) {
        const { target } = e

        ImageGallery.previews.forEach(preview => preview.classList.remove('active'))

        target.classList.add('active')

        ImageGallery.highlight.src = target.src
        Lightbox.image.src = target.src
    }
}

for (let card of cards) {
    card.addEventListener("click", function () {
        const recipeId = card.getAttribute("id")
        window.location.href = `/main/recipes/${recipeId}`
    })
}

for (let stat of status) {
    stat.addEventListener("click", function () {
        const text = stat.innerText
        const stat_content = stat.getAttribute('id')

        if (text == 'Esconder') {
            if (stat_content == "ingredients-list") {
                document.getElementById("ingredients").style.display = "none"
            } else if (stat_content == "preparation-list") {
                document.getElementById("preparation").style.display = "none"
            } else {
                document.getElementById("add-info").style.display = "none"
            }
            stat.innerHTML = "Mostrar"
        } else {
            if (stat_content == "ingredients-list") {
                document.getElementById("ingredients").style.display = "initial"
            } else if (stat_content == "preparation-list") {
                document.getElementById("preparation").style.display = "initial"
            } else {
                document.getElementById("add-info").style.display = "initial"
            }
            stat.innerHTML = "Esconder"
        }

    })
}

const getQueryString = {
    
}

document.querySelector(".add-ingredient").addEventListener("click", function addIngredients() {
    const ingredients = document.querySelector("#ingredients");
    const fieldContainer = document.querySelectorAll(".ingredient");

    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

    if (newField.children[0].value == "") return false;

    newField.children[0].value = "";
    ingredients.appendChild(newField);

})

document.querySelector(".add-step").addEventListener("click", function addSteps() {
    const ingredients = document.querySelector("#steps");
    const fieldContainer = document.querySelectorAll(".prepare");

    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

    if (newField.children[0].value == "") return false;

    newField.children[0].value = "";
    ingredients.appendChild(newField);

})