let cropper = null;
const image = document.getElementById('image');
const fileInput = document.getElementById('file-input');
const imgContainer = document.querySelector('.img-container');
const buttonGroup = document.querySelector('.button-group');
const previewSection = document.querySelector('.preview-section');
const previewImage = document.getElementById('preview');
const cropButton = document.getElementById('crop-btn');
const downloadButton = document.getElementById('download-btn');
const resetButton = document.getElementById('reset-btn');
const statusMessage = document.querySelector('.status-message');

function updateStatus(message) {
    statusMessage.textContent = message;
}

function downloadImage(imageUrl, filename) {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function resetAll() {
    // Reset file input
    fileInput.value = '';
    
    // Destroy cropper if it exists
    if (cropper) {
        cropper.destroy();
        cropper = null;
    }
    
    // Reset image
    image.src = '';
    imgContainer.style.display = 'none';
    
    // Reset preview
    previewImage.src = '';
    previewSection.style.display = 'none';
    
    // Reset buttons
    buttonGroup.style.display = 'none';
    cropButton.style.display = 'block';
    cropButton.innerHTML = '✅ Save & Download';
    cropButton.classList.remove('disabled');
    downloadButton.style.display = 'none';
    
    // Reset status
    updateStatus('Select an image to start cropping');
}

fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        // Reset the UI state
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }
        
        downloadButton.style.display = 'none';
        cropButton.classList.remove('disabled');
        cropButton.style.display = 'block';
        
        const reader = new FileReader();
        reader.onload = function(event) {
            image.src = event.target.result;
            imgContainer.style.display = 'block';
            buttonGroup.style.display = 'flex';
            previewSection.style.display = 'none';
            
            updateStatus('Drag the corners to adjust crop area');
            
            cropper = new Cropper(image, {
                aspectRatio: NaN,
                viewMode: 1,
                dragMode: 'crop',
                autoCropArea: 0.8,
                restore: false,
                guides: true,
                center: true,
                highlight: false,
                cropBoxMovable: true,
                cropBoxResizable: true,
                toggleDragModeOnDblclick: false,
                zoomable: false,
                scalable: false,
                rotatable: false,
                ready() {
                    this.cropper.crop();
                }
            });
        };
        reader.readAsDataURL(file);
    }
});

cropButton.addEventListener('click', function() {
    if (!cropper) return;
    
    // Add loading state
    cropButton.innerHTML = '<span class="loading"></span>Processing...';
    cropButton.classList.add('disabled');
    
    const croppedCanvas = cropper.getCroppedCanvas({
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
        width: cropper.getData().width, // Maintain original width
        height: cropper.getData().height, // Maintain original height
        fillColor: '#fff'
    });
    
    const croppedImage = croppedCanvas.toDataURL('image/png', 1.0); // Using PNG for lossless quality
    
    // Update preview
    previewImage.src = croppedImage;
    previewSection.style.display = 'block';
    
    // Disable further editing
    cropper.destroy();
    cropper = null;
    
    // Update UI
    updateStatus('Image cropped successfully!');
    cropButton.style.display = 'none';
    downloadButton.style.display = 'block';
    
    // Trigger download with PNG extension for lossless quality
    downloadImage(croppedImage, 'cropped-image.png');
});

downloadButton.addEventListener('click', function() {
    if (previewImage.src) {
        downloadImage(previewImage.src, 'cropped-image.png'); // Using PNG extension
    }
});

resetButton.addEventListener('click', resetAll);
