// Ticketer - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const config = {
        apiUrl: 'http://localhost:5000/api',
        reconnectInterval: 5000,
        maxRetries: 3
    };

    // State
    let printQueue = [];
    let isConnected = false;
    let retryCount = 0;

    // DOM Elements
    const labelForm = document.getElementById('labelForm');
    const previewBtn = document.getElementById('previewBtn');
    const clearBtn = document.getElementById('clearBtn');
    const refreshQueueBtn = document.getElementById('refreshQueue');
    const clearQueueBtn = document.getElementById('clearQueue');
    const previewModal = document.getElementById('previewModal');
    const printFromPreviewBtn = document.getElementById('printFromPreview');
    const modalCloseButtons = document.querySelectorAll('.modal-close');
    const queueStatus = document.getElementById('queueStatus');
    const printQueueElement = document.getElementById('printQueue');
    const serverStatusElement = document.getElementById('serverStatus');
    const printerStatusElement = document.getElementById('printerStatus');
    const queueCountElement = document.getElementById('queueCount');
    const lastPrintElement = document.getElementById('lastPrint');

    // Initialize
    initEventListeners();
    checkServerConnection();
    startQueuePolling();

    // Event Listeners
    function initEventListeners() {
        // Form submission
        labelForm.addEventListener('submit', handleFormSubmit);
        
        // Preview button
        previewBtn.addEventListener('click', showPreview);
        
        // Clear form
        clearBtn.addEventListener('click', clearForm);
        
        // Queue controls
        refreshQueueBtn.addEventListener('click', refreshQueue);
        clearQueueBtn.addEventListener('click', clearQueue);
        
        // Modal controls
        printFromPreviewBtn.addEventListener('click', printFromPreview);
        modalCloseButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                previewModal.classList.remove('show');
            });
        });
        
        // Close modal on outside click
        previewModal.addEventListener('click', (e) => {
            if (e.target === previewModal) {
                previewModal.classList.remove('show');
            }
        });
        
        // Settings/Help/About buttons
        document.getElementById('settingsBtn').addEventListener('click', showSettings);
        document.getElementById('helpBtn').addEventListener('click', showHelp);
        document.getElementById('aboutBtn').addEventListener('click', showAbout);
    }

    // Form Handling
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = {
            type: document.getElementById('labelType').value,
            title: document.getElementById('title').value,
            content: document.getElementById('content').value,
            quantity: parseInt(document.getElementById('quantity').value),
            priority: document.getElementById('priority').value,
            options: {
                addBarcode: document.getElementById('addBarcode').checked,
                addTimestamp: document.getElementById('addTimestamp').checked,
                cutAfterPrint: document.getElementById('cutAfterPrint').checked
            },
            timestamp: new Date().toISOString()
        };
        
        submitPrintJob(formData);
    }

    function clearForm() {
        labelForm.reset();
        document.getElementById('quantity').value = 1;
        document.getElementById('priority').value = 'normal';
        document.getElementById('addBarcode').checked = true;
        document.getElementById('addTimestamp').checked = false;
        document.getElementById('cutAfterPrint').checked = true;
        
        showStatus('Form cleared', 'success');
    }

    // Preview Functions
    function showPreview() {
        if (!labelForm.checkValidity()) {
            labelForm.reportValidity();
            return;
        }
        
        // Update preview content
        document.getElementById('previewTitle').textContent = 
            document.getElementById('title').value || 'Sample Label';
        
        document.getElementById('previewContent').textContent = 
            document.getElementById('content').value || 'Sample content...';
        
        // Show/hide barcode based on checkbox
        const barcodeElement = document.getElementById('previewBarcode');
        if (document.getElementById('addBarcode').checked) {
            barcodeElement.style.display = 'block';
        } else {
            barcodeElement.style.display = 'none';
        }
        
        // Update timestamp
        if (document.getElementById('addTimestamp').checked) {
            document.getElementById('previewTimestamp').textContent = 
                new Date().toLocaleString();
        } else {
            document.getElementById('previewTimestamp').textContent = '';
        }
        
        // Show modal
        previewModal.classList.add('show');
    }

    function printFromPreview() {
        const formData = {
            type: document.getElementById('labelType').value,
            title: document.getElementById('title').value,
            content: document.getElementById('content').value,
            quantity: parseInt(document.getElementById('quantity').value),
            priority: document.getElementById('priority').value,
            options: {
                addBarcode: document.getElementById('addBarcode').checked,
                addTimestamp: document.getElementById('addTimestamp').checked,
                cutAfterPrint: document.getElementById('cutAfterPrint').checked
            },
            timestamp: new Date().toISOString()
        };
        
        submitPrintJob(formData);
        previewModal.classList.remove('show');
    }

    // API Functions
    async function checkServerConnection() {
        try {
            const response = await fetch(`${config.apiUrl}/health`);
            if (response.ok) {
                const data = await response.json();
                updateServerStatus('online', data.status);
                retryCount = 0;
                isConnected = true;
            } else {
                throw new Error('Server not responding');
            }
        } catch (error) {
            updateServerStatus('offline', error.message);
            isConnected = false;
            retryCount++;
            
            if (retryCount <= config.maxRetries) {
                setTimeout(checkServerConnection, config.reconnectInterval);
            }
        }
    }

    async function submitPrintJob(jobData) {
        if (!isConnected) {
            showStatus('Cannot submit print job: Server is offline', 'error');
            return;
        }
        
        showStatus('Submitting print job...', 'info');
        
        try {
            const response = await fetch(`${config.apiUrl}/print`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jobData)
            });
            
            if (response.ok) {
                const result = await response.json();
                showStatus(`Print job submitted (ID: ${result.jobId})`, 'success');
                updateLastPrint();
                refreshQueue();
            } else {
                throw new Error('Failed to submit print job');
            }
        } catch (error) {
            showStatus(`Error: ${error.message}`, 'error');
        }
    }

    async function refreshQueue() {
        if (!isConnected) {
            queueStatus.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Server offline';
            queueStatus.className = 'status error';
            return;
        }
        
        try {
            const response = await fetch(`${config.apiUrl}/queue`);
            if (response.ok) {
                const data = await response.json();
                printQueue = data.queue || [];
                updateQueueDisplay();
                updateQueueCount();
            }
        } catch (error) {
            console.error('Failed to fetch queue:', error);
        }
    }

    async function clearQueue() {
        if (!confirm('Are you sure you want to clear all print jobs?')) {
            return;
        }
        
        try {
            const response = await fetch(`${config.apiUrl}/queue`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                showStatus('Print queue cleared', 'success');
                refreshQueue();
            }
        } catch (error) {
            showStatus('Failed to clear queue', 'error');
        }
    }

    // Display Functions
    function updateQueueDisplay() {
        if (printQueue.length === 0) {
            printQueueElement.innerHTML = `
                <div class="queue-empty">
                    <i class="fas fa-inbox"></i>
                    <p>No print jobs in queue</p>
                </div>
            `;
            clearQueueBtn.disabled = true;
            return;
        }
        
        clearQueueBtn.disabled = false;
        
        const queueHTML = printQueue.map(job => `
            <div class="queue-item priority-${job.priority}">
                <div class="queue-item-info">
                    <h4>${job.title}</h4>
                    <p>${job.content.substring(0, 50)}${job.content.length > 50 ? '...' : ''}</p>
                    <div class="queue-item-meta">
                        <span>Type: ${job.type}</span> • 
                        <span>Qty: ${job.quantity}</span> • 
                        <span>${formatTime(job.timestamp)}</span>
                    </div>
                </div>
                <div class="queue-item-status status-${job.status}">
                    ${job.status}
                </div>
            </div>
        `).join('');
        
        printQueueElement.innerHTML = queueHTML;
    }

    function updateServerStatus(status, message) {
        const badge = status === 'online' ? 
            '<span class="status-badge status-online">Online</span>' :
            '<span class="status-badge status-offline">Offline</span>';
        
        serverStatusElement.innerHTML = badge;
        
        if (status === 'online') {
            queueStatus.innerHTML = '<i class="fas fa-check-circle"></i> Connected to print server';
            queueStatus.className = 'status success';
        } else {
            queueStatus.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
            queueStatus.className = 'status error';
        }
    }

    function updateQueueCount() {
        queueCountElement.textContent = `${printQueue.length} job${printQueue.length !== 1 ? 's' : ''}`;
    }

    function updateLastPrint() {
        const now = new Date();
        lastPrintElement.textContent = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }

    function showStatus(message, type = 'info') {
        // Create status element
        const statusEl = document.createElement('div');
        statusEl.className = `status ${type}`;
        statusEl.innerHTML = `
            <i class="fas fa-${getStatusIcon(type)}"></i>
            ${message}
        `;
        
        // Insert at top of main content
        const mainContent = document.querySelector('.main-content');
        mainContent.insertBefore(statusEl, mainContent.firstChild);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (statusEl.parentNode) {
                statusEl.remove();
            }
        }, 5000);
    }

    function getStatusIcon(type) {
        switch(type) {
            case 'success': return 'check-circle';
            case 'error': return 'exclamation-circle';
            case 'warning': return 'exclamation-triangle';
            default: return 'info-circle';
        }
    }

    // Utility Functions
    function formatTime(isoString) {
        const date = new Date(isoString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        
        return date.toLocaleDateString();
    }

    function startQueuePolling() {
        // Poll queue every 10 seconds
        setInterval(() => {
            if (isConnected) {
                refreshQueue();
            }
        }, 10000);
        
        // Initial refresh
        refreshQueue();
    }

    // Placeholder functions for settings/help/about
    function showSettings() {
        alert('Settings dialog would open here.\n\nConfigurable options:\n• Server URL\n• Default printer settings\n• Label templates\n• Notification preferences');
    }

    function showHelp() {
        alert('Ticketer Help\n\n1. Fill in the label details\n2. Click "Preview" to see how it will look\n3. Click "Print Label" to send to queue\n4. Monitor queue status in real-time\n\nFor printer setup, see the Raspberry Pi setup guide.');
    }

    function showAbout() {
        alert('Ticketer v1.0\n\nA web-based label printing system\nDesigned for Raspberry Pi print servers\n\nFeatures:\n• Real-time print queue\n• Multiple label types\n• Priority system\n• Preview before printing');
    }

    // Export for debugging
    window.ticketer = {
        config,
        printQueue,
        isConnected,
        refreshQueue,
        submitPrintJob,
        clearForm
    };
});