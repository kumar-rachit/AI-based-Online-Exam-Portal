/**
 * Main JavaScript file for Online Exam Portal
 * Contains common functionality used across the application
 */

// Initialize when DOM is ready
$(document).ready(function() {
    // Auto-hide alerts after 5 seconds
    setTimeout(function() {
        $('.alert').fadeOut('slow');
    }, 5000);
    
    // Confirm delete actions
    $('.delete-btn').on('click', function(e) {
        if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
            e.preventDefault();
            return false;
        }
    });
    
    // Add active class to current nav item
    const currentPath = window.location.pathname;
    $('.navbar-nav .nav-link').each(function() {
        const linkPath = $(this).attr('href');
        if (currentPath === linkPath || currentPath.startsWith(linkPath + '/')) {
            $(this).addClass('active');
        }
    });
    
    // Initialize tooltips if Bootstrap tooltips are used
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
    
    // Form validation enhancement
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });
});

/**
 * Format date to readable string
 * @param {string} dateString - Date string to format
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

/**
 * Format duration in seconds to readable format
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration
 */
function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    let result = [];
    if (hours > 0) result.push(`${hours}h`);
    if (minutes > 0) result.push(`${minutes}m`);
    if (secs > 0 || result.length === 0) result.push(`${secs}s`);
    
    return result.join(' ');
}

/**
 * Show loading spinner
 */
function showLoading() {
    const loadingHtml = `
        <div class="spinner-container" id="loadingSpinner">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `;
    $('body').append(loadingHtml);
}

/**
 * Hide loading spinner
 */
function hideLoading() {
    $('#loadingSpinner').remove();
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of toast (success, error, warning, info)
 */
function showToast(message, type = 'info') {
    const bgClass = {
        'success': 'bg-success',
        'error': 'bg-danger',
        'warning': 'bg-warning',
        'info': 'bg-info'
    }[type] || 'bg-info';
    
    const toastHtml = `
        <div class="toast align-items-center text-white ${bgClass} border-0" role="alert" 
             style="position: fixed; top: 80px; right: 20px; z-index: 9999;">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" 
                        data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;
    
    $('body').append(toastHtml);
    const toastElement = $('.toast').last()[0];
    const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
    toast.show();
    
    // Remove from DOM after hiding
    toastElement.addEventListener('hidden.bs.toast', function() {
        $(toastElement).remove();
    });
}

/**
 * Confirm action with custom message
 * @param {string} message - Confirmation message
 * @param {function} callback - Callback function if confirmed
 */
function confirmAction(message, callback) {
    if (confirm(message)) {
        callback();
    }
}

/**
 * Debounce function for search inputs
 * @param {function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        showToast('Copied to clipboard!', 'success');
    }, function(err) {
        showToast('Failed to copy text', 'error');
    });
}

/**
 * Smooth scroll to element
 * @param {string} elementId - ID of element to scroll to
 */
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

/**
 * Print page content
 */
function printPage() {
    window.print();
}

/**
 * Export table to CSV
 * @param {string} tableId - ID of table to export
 * @param {string} filename - Name of CSV file
 */
function exportTableToCSV(tableId, filename) {
    const table = document.getElementById(tableId);
    let csv = [];
    const rows = table.querySelectorAll('tr');
    
    for (let i = 0; i < rows.length; i++) {
        const row = [], cols = rows[i].querySelectorAll('td, th');
        
        for (let j = 0; j < cols.length; j++) {
            let data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, '').replace(/(\s\s)/gm, ' ');
            data = data.replace(/"/g, '""');
            row.push('"' + data + '"');
        }
        
        csv.push(row.join(','));
    }
    
    const csvString = csv.join('\n');
    const link = document.createElement('a');
    link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvString);
    link.download = filename;
    link.click();
}

// Global error handler
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Error: ' + msg + '\nURL: ' + url + '\nLine: ' + lineNo);
    return false;
};