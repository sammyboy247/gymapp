document.addEventListener('DOMContentLoaded', () => {
    const files = {
        'tasklist': 'tasklist.md',
        'action-queue': 'ACTION-QUEUE.md',
        'status-report': 'STATUS-REPORT.md',
        'workflow-spec': 'MULTI-AGENT-WORKFLOW-SPECIFICATION.md'
    };

    const auditFiles = [
        'ACCESSIBILITY_AUDIT.md',
        'ERROR_HANDLING_AUDIT.md',
        'MOBILE_RESPONSIVENESS_AUDIT.md',
        'PERFORMANCE_AUDIT.md'
    ];

    let auditChart = null;
    let msnry = null;

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

    const renderAuditProgress = async () => {
        let totalTasks = 0;
        let completedTasks = 0;

        for (const filePath of auditFiles) {
            try {
                const response = await fetch(filePath);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const text = await response.text();
                const tasks = text.split('\n').filter(line => line.startsWith('- [') || line.startsWith('* ['));
                totalTasks += tasks.length;
                completedTasks += tasks.filter(task => task.includes('[x]')).length;
            } catch (error) {
                console.error(`Error fetching or parsing ${filePath}:`, error);
            }
        }

        const auditData = {
            labels: ['Completed', 'Remaining'],
            datasets: [{
                data: [completedTasks, totalTasks - completedTasks],
                backgroundColor: ['#28a745', '#dc3545'],
            }]
        };

        if (auditChart) {
            auditChart.data = auditData;
            auditChart.update();
        } else {
            const ctx = document.getElementById('audit-chart').getContext('2d');
            auditChart = new Chart(ctx, {
                type: 'doughnut',
                data: auditData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                }
            });
        }
    };

    const initMasonry = () => {
        const grid = document.querySelector('.grid');
        msnry = new Masonry(grid, {
            itemSelector: '.grid-item',
            columnWidth: '.grid-sizer',
            percentPosition: true
        });
    };

    const refreshDashboard = async () => {
        await Promise.all(Object.entries(files).map(([elementId, filePath]) => fetchAndRender(elementId, filePath)));
        await renderAuditProgress();

        if (msnry) {
            msnry.reloadItems();
            msnry.layout();
        } else {
            initMasonry();
        }
    };

    refreshDashboard();
    setInterval(refreshDashboard, 30000); // Refresh every 30 seconds
});
