// Add these variables to track the upload state
let imageUploaded = false;
let selectedConversion = null; // Track selected conversion type
let currentlyHighlighted = null;
let fileInput = document.getElementById('fileInput');

// Function to open file explorer (conditionally)
function openFileExplorer(tool) {
    if (tool === 'image' && !imageUploaded) {
        document.getElementById('fileInput').click();
    }
}

// Function to preview image when selected
function previewImage(event) {
    var file = event.target.files[0];

    // Check file format
    if (!file.type.startsWith('image/')) {
        alert('File format not supported!');
        fileInput.value = ''; // Clear the file input
        resetConverter();
        return;
    }

    var reader = new FileReader();

    reader.onload = function(e) {
        var previewImage = document.getElementById('preview-image');
        var dropText = document.getElementById('drop-text');
        var fileType = document.getElementById('file-type');
        var fileSize = document.getElementById('file-size');

        // Hide the drop text and show the preview image
        dropText.style.display = 'none';
        previewImage.style.display = 'block';
        previewImage.src = e.target.result;
        previewImage.style.maxWidth = '100%';
        previewImage.style.maxHeight = '400px';

        // Display file information
        fileType.textContent = 'Type: ' + file.type;
        fileSize.textContent = 'Size: ' + formatFileSize(file.size);
        document.getElementById('file-type').style.display = 'block';
        document.getElementById('file-size').style.display = 'block';

        // Show convert button only after image is uploaded
        document.getElementById('convertBtn').style.display = 'inline-block';
        document.getElementById('convertToPdfBtn').style.display = 'inline-block';
        document.getElementById('downloadBtn').style.display = 'none';
        document.getElementById('resetBtn').style.display = 'inline-block';

        // Set imageUploaded to true
        imageUploaded = true;
    };

    if (file) {
        reader.readAsDataURL(file);
    }
}

// Function to format file size to readable format
function formatFileSize(bytes) {
    if (bytes < 1024) {
        return bytes + ' bytes';
    } else if (bytes < 1048576) {
        return (bytes / 1024).toFixed(2) + ' KB';
    } else {
        return (bytes / 1048576).toFixed(2) + ' MB';
    }
}

// Function to reset the converter (clear preview and show drop text again)
function resetConverter() {
    fileInput.value = '';
    var previewImage = document.getElementById('preview-image');
    var dropText = document.getElementById('drop-text');
    document.getElementById('file-type').style.display = 'none';
    document.getElementById('file-size').style.display = 'none';

    // Restore drop text and hide the preview image
    dropText.style.display = 'block';
    previewImage.style.display = 'none';

    document.getElementById('progress-container').style.display = 'none';
    document.getElementById('downloadBtn').style.display = 'none';
    document.getElementById('convertBtn').style.display = 'none'; // Hide convert button
    document.getElementById('convertToPdfBtn').style.display = 'none'; // Hide convertToPdf button
    document.getElementById('resetBtn').style.display = 'none'; // Hide reset button when reset
    selectedConversion = null;
    imageUploaded = false; // Reset the image uploaded state

    // Reset the button highlights as well
    const options = document.querySelectorAll('.options-side .option');
    options.forEach(option => {
        option.classList.remove('active');
    });
}

// Function to show the selected tool/section
function showTool(tool) {
    // Hide all sections first
    document.getElementById('imageTool').style.display = 'none';
    document.getElementById('aboutSection').style.display = 'none';
    document.getElementById('contactSection').style.display = 'none';
    closeMenu();

    // Get the clicked menu items
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => item.classList.remove('active'));

    // Add active class to the clicked menu item
    const menuItem = document.querySelector(`.menu-item[data-section="${tool}"]`);
    if (menuItem) {
        menuItem.classList.add('active');
    }

    if (tool === 'image') {
        document.getElementById('imageTool').style.display = 'block';
    } else if (tool === 'about') {
        document.getElementById('aboutSection').style.display = 'block';
    } else if (tool === 'contact') {
        document.getElementById('contactSection').style.display = 'block';
    }
}

// Function to show the selected conversion type on the tool heading
function showConversion(type) {
    document.getElementById('converter-title').textContent = type;
}

function highlightTile(element, conversionType) {
    // Remove active class from all options
    const options = document.querySelectorAll('.options-side .option');
    options.forEach(option => {
        option.classList.remove('active');
    });

    // Add active class to the clicked option
    element.classList.add('active');
    showConversion(conversionType);
    selectedConversion = conversionType;

    // Show the convert button once a conversion is selected
    document.getElementById('convertBtn').style.display = 'inline-block';
}

// Function to simulate converting to PDF
function convertToPdf() {
    if (!imageUploaded) {
        alert('Please upload an image to convert to PDF.');
        return;
    }
    document.getElementById('progress-container').style.display = 'block';
    var progressBar = document.getElementById('progress-bar');
    var convertBtn = document.getElementById('convertToPdfBtn');
    var progress = 0;
    var interval = setInterval(function() {
        if (progress >= 100) {
            clearInterval(interval);
            document.getElementById('downloadBtn').style.display = 'inline-block';
            document.getElementById('convertToPdfBtn').style.display = 'none';
            document.getElementById('resetBtn').style.display = 'inline-block';
            progressBar.style.width = '100%';
        } else {
            progress += 10;
            progressBar.style.width = progress + '%';
        }
    }, 500);
}

// Dummy convert function (simulate conversion)
function convertFile() {
    if (!imageUploaded || !selectedConversion) {
        alert('Please upload an image and select a conversion type.');
        return;
    }
    // Show download button
    document.getElementById('downloadBtn').style.display = 'inline-block';
}

// Function to simulate a download
function simulateDownload() {
    if (!imageUploaded) {
        alert('Please upload an image to convert.');
        return;
    }

    // Check if converting to PDF
    if (selectedConversion === 'Image to PDF') {
        // Use a default name for PDF downloads
        var link = document.createElement('a');
        link.href = document.getElementById('preview-image').src; // Use the preview image as the source
        link.download = 'converted_image.pdf'; // Set the download file name
    }
     else { //check for other options
         var link = document.createElement('a');
         link.href = document.getElementById('preview-image').src; // Use the preview image as the source
         link.download = `converted_image.${selectedConversion.split(' ')[2].toLowerCase()}`; // Get format

         // Append to the document
         document.body.appendChild(link);

         // Trigger the download
         link.click();

         // Remove the link
         document.body.removeChild(link);
    }
}

// Function to toggle the sliding menu
function toggleMenu() {
    const menu = document.getElementById('sliding-menu');
    menu.classList.toggle('open');
}

// Function to close the sliding menu
function closeMenu() {
    const menu = document.getElementById('sliding-menu');
    menu.classList.remove('open');
}

// Handle drag and drop functionality
let dropArea = document.getElementById('drop-area');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false)
});

function preventDefaults(e) {
    e.preventDefault()
    e.stopPropagation()
}

dropArea.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    let dt = e.dataTransfer
    let files = dt.files

    fileInput.files = files; // Assign the files to the file input
    previewImage({
        target: fileInput
    }); // Trigger the preview
}