// JavaScript Code for Uploading Files to Google Drive

let accessToken = '';

// Initialize Google API Client
function initializeGapiClient() {
    gapi.load('client:auth2', async () => {
        await gapi.client.init({
            clientId: '147934510488-allie69121uoboqbr26nhql7u0205res.apps.googleusercontent.com',
            scope: 'https://www.googleapis.com/auth/drive.file',
        });
        const authInstance = gapi.auth2.getAuthInstance();

        authInstance.isSignedIn.listen(updateSigninStatus);
        updateSigninStatus(authInstance.isSignedIn.get());
    });
}

// Update Sign-In Status
function updateSigninStatus(isSignedIn) {
    const uploadBtn = document.getElementById('uploadBtn');
    if (isSignedIn) {
        accessToken = gapi.auth.getToken().access_token;
        document.getElementById('fileInput').style.display = 'block';
        uploadBtn.style.display = 'inline-block';
        uploadBtn.disabled = false;
    } else {
        accessToken = '';
        document.getElementById('fileInput').style.display = 'none';
        uploadBtn.style.display = 'none';
    }
}

// Handle File Upload
async function uploadFilesToDrive(files) {
    const uploadStatus = document.getElementById('uploadStatus');
    uploadStatus.textContent = 'Uploading files...';

    try {
        for (const file of files) {
            const metadata = {
                name: file.name,
                mimeType: file.type,
            };

            const form = new FormData();
            form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
            form.append('file', file);

            const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
                method: 'POST',
                headers: new Headers({ Authorization: `Bearer ${accessToken}` }),
                body: form,
            });

            if (!response.ok) {
                throw new Error(`Failed to upload file: ${file.name}`);
            }
        }

        uploadStatus.textContent = 'All files uploaded successfully!';
    } catch (error) {
        uploadStatus.textContent = `Error: ${error.message}`;
    }
}

// Event Listeners
document.getElementById('uploadBtn').addEventListener('click', () => {
    const fileInput = document.getElementById('fileInput');
    const files = fileInput.files;
    if (files.length > 0) {
        uploadFilesToDrive(files);
    }
});

document.getElementById('fileInput').addEventListener('change', () => {
    const fileList = document.getElementById('fileList');
    const files = document.getElementById('fileInput').files;
    fileList.innerHTML = '';

    for (const file of files) {
        const fileItem = document.createElement('div');
        fileItem.textContent = file.name;
        fileItem.className = 'file-item';
        fileList.appendChild(fileItem);
    }
});

// Load Google API client library and initialize
gapi.load('client', initializeGapiClient);
