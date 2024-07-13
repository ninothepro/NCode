document.getElementById('setup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const repoName = document.getElementById('repo-name').value;
    const token = 'YOUR_GITHUB_TOKEN';  // Replace with your GitHub token

    const response = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: repoName,
            auto_init: true,
            private: false
        })
    });

    const result = await response.json();
    const messageElement = document.getElementById('message');

    if (response.ok) {
        messageElement.textContent = `Repository ${repoName} created successfully.`;
        window.location.href = `dashboard.html?repo=${repoName}`;
    } else {
        messageElement.textContent = `Error: ${result.message}`;
    }
});
