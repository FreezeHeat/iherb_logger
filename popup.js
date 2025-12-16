const dataList = document.getElementById('dataList');
const downloadAllBtn = document.getElementById('downloadAll');
const deleteAllBtn = document.getElementById('deleteAll');

// --- Messaging Functions ---

function fetchData() {
    chrome.runtime.sendMessage({ type: "GET_DATA" }, (response) => {
        renderData(response.data);
    });
}

function deleteRow(id) {
    chrome.runtime.sendMessage({ type: "DELETE_ROW", id: id }, fetchData);
}

function deleteAll() {
    if (confirm('Are you sure you want to delete all logged data?')) {
        chrome.runtime.sendMessage({ type: "DELETE_ALL" }, fetchData);
    }
}

// --- Data Management and Rendering ---

function renderData(data) {
    dataList.innerHTML = ''; // Clear previous list
    if (data.length === 0) {
        dataList.textContent = 'No data logged yet.';
        return;
    }

    data.forEach(item => {
        const row = document.createElement('div');
        row.className = 'data-row';

        row.innerHTML = `
            <div class="data-info">
                <strong>${item.date}</strong> (${item.size}) - <a href="${item.url}" target="_blank">View Page</a>
            </div>
            <div class="data-actions">
                <button class="download-row" data-id="${item.id}">Download</button>
                <button class="delete-row" data-id="${item.id}">Delete</button>
            </div>
        `;
        dataList.appendChild(row);
    });

    // Attach event listeners for dynamic buttons
    document.querySelectorAll('.delete-row').forEach(button => {
        button.addEventListener('click', (e) => deleteRow(Number(e.target.dataset.id)));
    });
    document.querySelectorAll('.download-row').forEach(button => {
        button.addEventListener('click', (e) => downloadRow(Number(e.target.dataset.id), data));
    });
}

function downloadRow(id, data) {
    const item = data.find(i => i.id === id);
    if (!item) return;
    
    const filename = `iHerb_product_${item.id}.json`;
    const dataStr = JSON.stringify(item, null, 2);
    download(dataStr, filename, 'application/json');
}

function downloadAll(data) {
    if (data.length === 0) return;
    const filename = `iHerb_all_products_${Date.now()}.json`;
    const dataStr = JSON.stringify(data, null, 2);
    download(dataStr, filename, 'application/json');
}

// Generic download utility (creates a temporary link)
function download(data, filename, type) {
    const blob = new Blob([data], { type: type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// --- Initialization ---

downloadAllBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: "GET_DATA" }, (response) => {
        downloadAll(response.data);
    });
});
deleteAllBtn.addEventListener('click', deleteAll);

// Load data when the popup opens
fetchData();
