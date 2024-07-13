document.addEventListener('DOMContentLoaded', () => {
    const repoName = new URLSearchParams(window.location.search).get('repo');
    const token = 'YOUR_GITHUB_TOKEN';  // Replace with your GitHub token

    // Fetch files in the repository
    async function fetchFiles() {
        const response = await fetch(`https://api.github.com/repos/YOUR_USERNAME/${repoName}/contents`, {
            headers: {
                'Authorization': `token ${token}`
            }
        });
        const files = await response.json();
        const fileList = document.getElementById('file-list');

        fileList.innerHTML = '';
        files.forEach(file => {
            const listItem = document.createElement('li');
            listItem.textContent = file.name;
            listItem.addEventListener('click', () => loadFile(file.path));
            fileList.appendChild(listItem);
        });
    }

    // Load file content
    async function loadFile(path) {
        const response = await fetch(`https://api.github.com/repos/YOUR_USERNAME/${repoName}/contents/${path}`, {
            headers: {
                'Authorization': `token ${token}`
            }
        });
        const file = await response.json();
        const content = atob(file.content);
        document.getElementById('file-editor').value = content;
        document.getElementById('save-file-btn').dataset.path = path;
    }

    // Save file content
    document.getElementById('save-file-btn').addEventListener('click', async () => {
        const path = document.getElementById('save-file-btn').dataset.path;
        const content = document.getElementById('file-editor').value;
        const encodedContent = btoa(content);

        const response = await fetch(`https://api.github.com/repos/YOUR_USERNAME/${repoName}/contents/${path}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'Update file',
                content: encodedContent,
                sha: (await fetch(`https://api.github.com/repos/YOUR_USERNAME/${repoName}/contents/${path}`, {
                    headers: {
                        'Authorization': `token ${token}`
                    }
                }).then(res => res.json())).sha
            })
        });

        if (response.ok) {
            alert('File saved successfully.');
        } else {
            alert('Error saving file.');
        }
    });

    // Add new file
    document.getElementById('new-file-btn').addEventListener('click', () => {
        const fileName = prompt('Enter the file name (with extension):');
        if (fileName) {
            const filePath = `${fileName}`;
            const content = '';
            const encodedContent = btoa(content);

            fetch(`https://api.github.com/repos/YOUR_USERNAME/${repoName}/contents/${filePath}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: 'Create new file',
                    content: encodedContent
                })
            }).then(response => {
                if (response.ok) {
                    alert('File created successfully.');
                    fetchFiles();
                } else {
                    alert('Error creating file.');
                }
            });
        }
    });

    fetchFiles();
});
