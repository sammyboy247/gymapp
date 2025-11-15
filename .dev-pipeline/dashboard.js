document.addEventListener('DOMContentLoaded', () => {
    const files = {
        'tasklist': 'tasklist.md',
        'action-queue': 'ACTION-QUEUE.md',
        'status-report': 'STATUS-REPORT.md',
        'workflow-spec': 'MULTI-AGENT-WORKFLOW-SPECIFICATION.md'
    };

    const fetchAndRender = async (elementId, filePath) => {
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const text = await response.text();
            const content = marked.parse(text);
            document.getElementById(elementId).innerHTML = content;

            if (elementId === 'tasklist') {
                const tasks = text.split('\n').filter(line => line.startsWith('- [') || line.startsWith('* ['));
                const completedTasks = tasks.filter(task => task.includes('[x]')).length;
                const totalTasks = tasks.length;
                const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

                const progressBar = `
                    <div class="progress">
                        <div class="progress-bar" role="progressbar" style="width: ${progress}%" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100">
                            ${Math.round(progress)}%
                        </div>
                    </div>
                    <p>${completedTasks} of ${totalTasks} tasks complete.</p>
                `;
                document.getElementById(elementId).insertAdjacentHTML('afterbegin', progressBar);
            }

        } catch (error) {
            console.error(`Error fetching or rendering ${filePath}:`, error);
            document.getElementById(elementId).innerHTML = `<p class="text-danger">Error loading content.</p>`;
        }
    };

    for (const [elementId, filePath] of Object.entries(files)) {
        fetchAndRender(elementId, filePath);
    }
});
