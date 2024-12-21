class FormHandler {
    constructor() {
        this.popup = document.getElementById('submitFormPopup');
        this.form = document.getElementById('submissionForm');
        this.fileInput = document.getElementById('file');
        this.fileNameDisplay = document.querySelector('.file-name');
        this.startButtons = document.querySelectorAll('button[data-action="start"]');
        this.closeButton = document.querySelector('.close-popup');
        
        // Initialize submissions array from localStorage
        this.submissions = JSON.parse(localStorage.getItem('formSubmissions')) || [];
        
        // Submissions viewer elements
        this.submissionsViewer = document.getElementById('submissionsViewer');
        this.viewSubmissionsBtn = document.getElementById('viewSubmissionsBtn');
        this.closeSubmissionsBtn = document.querySelector('.close-submissions');
        
        this.initialize();
    }

    initialize() {
        // Open popup on button click
        this.startButtons.forEach(button => {
            button.addEventListener('click', () => this.openPopup());
        });

        // Close popup
        this.closeButton.addEventListener('click', () => this.closePopup());
        this.popup.addEventListener('click', (e) => {
            if (e.target === this.popup) this.closePopup();
        });

        // Escape key to close popup
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.popup.classList.contains('active')) {
                this.closePopup();
            }
        });

        // File input handling
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));

        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Prevent form submission on enter key in inputs
        this.form.querySelectorAll('input').forEach(input => {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                }
            });
        });

        // Initialize submissions viewer
        if (this.viewSubmissionsBtn) {
            this.viewSubmissionsBtn.addEventListener('click', () => this.showSubmissions());
        }
        if (this.closeSubmissionsBtn) {
            this.closeSubmissionsBtn.addEventListener('click', () => this.hideSubmissions());
        }
    }

    openPopup() {
        // First make the overlay visible but transparent
        this.popup.style.display = 'flex';
        // Force a reflow to enable the transition
        this.popup.offsetHeight;
        // Now add the active class for the transition
        this.popup.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Reset form state
        this.form.reset();
        this.fileNameDisplay.textContent = '';
        
        // Ensure form elements are visible
        requestAnimationFrame(() => {
            this.form.querySelectorAll('.form-group').forEach(group => {
                group.style.opacity = '1';
                group.style.transform = 'translateY(0)';
            });
        });
    }

    closePopup() {
        // Start the closing animation
        this.popup.classList.remove('active');
        
        // Wait for the animation to complete before hiding completely
        setTimeout(() => {
            this.popup.style.display = 'none';
            document.body.style.overflow = '';
            this.form.reset();
            this.fileNameDisplay.textContent = '';
            // Reset form element positions
            this.form.querySelectorAll('.form-group').forEach(group => {
                group.style.opacity = '0';
                group.style.transform = 'translateY(20px)';
            });
        }, 400); // Match this with the transition duration
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            const fileType = file.type;
            const fileSize = file.size / (1024 * 1024); // Convert to MB

            if ((fileType === 'application/pdf' || fileType === 'text/csv') && fileSize <= 10) {
                this.fileNameDisplay.textContent = `${file.name} (${fileSize.toFixed(2)} MB)`;
                this.fileNameDisplay.style.color = 'var(--accent-blue)';
            } else {
                this.fileNameDisplay.textContent = fileSize > 10 
                    ? 'File size should be less than 10MB'
                    : 'Please select a PDF or CSV file';
                this.fileNameDisplay.style.color = 'red';
                this.fileInput.value = '';
            }
        }
    }

    async handleSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const submitButton = form.querySelector('button[type="submit"]');
        const formData = new FormData(form);

        if (!this.validateForm(formData)) {
            return;
        }

        try {
            submitButton.classList.add('loading');
            submitButton.disabled = true;
            
            // Create file URL if file exists
            let fileUrl = '';
            let fileData = null;
            const file = this.fileInput.files[0];
            if (file) {
                // Store the actual file data
                fileData = await this.readFileAsBase64(file);
                fileUrl = URL.createObjectURL(file);
            }
            
            // Create submission object
            const submission = {
                id: Date.now(),
                timestamp: new Date().toISOString(),
                name: formData.get('name'),
                email: formData.get('email'),
                request: formData.get('request'),
                fileName: file?.name || 'No file',
                fileUrl: fileUrl,
                fileData: fileData,
                fileType: file?.type || ''
            };

            // Add to submissions array
            this.submissions.push(submission);
            
            // Save to localStorage
            localStorage.setItem('formSubmissions', JSON.stringify(this.submissions));
            
            console.log('Submission saved:', submission);
            console.log('All submissions:', this.submissions);

            this.showNotification('Request submitted successfully!', 'success');
            this.closePopup();
        } catch (error) {
            console.error('Submission error:', error.message);
            this.showNotification(
                'Error submitting form. Please try again.',
                'error'
            );
        } finally {
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
        }
    }

    validateForm(formData) {
        const email = formData.get('email');
        const file = formData.get('file');

        if (!this.isValidEmail(email)) {
            this.showNotification('Please enter a valid email address.', 'error');
            return false;
        }

        if (!file || !file.name) {
            this.showNotification('Please upload a file.', 'error');
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(n => n.remove());

        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    showSubmissions() {
        const password = prompt('Enter password to view submissions:');
        const correctPassword = 'yousri123'; // You can change this to your preferred password
        
        if (password !== correctPassword) {
            this.showNotification('Incorrect password', 'error');
            return;
        }
        
        const tableBody = document.getElementById('submissionsTableBody');
        if (!tableBody) return;

        // Clear existing rows
        tableBody.innerHTML = '';

        // Get submissions from localStorage
        const submissions = JSON.parse(localStorage.getItem('formSubmissions')) || [];

        // Add rows for each submission
        submissions.reverse().forEach(submission => {
            const row = document.createElement('tr');
            // Create download link for PDF
            let fileCell = 'No file';
            if (submission.fileData && submission.fileName) {
                const blob = this.base64toBlob(
                    submission.fileData, 
                    submission.fileType
                );
                const url = URL.createObjectURL(blob);
                fileCell = `
                    <a href="${url}" 
                       download="${submission.fileName}"
                       class="file-link">
                        <i class="fas fa-file-alt"></i> 
                        ${submission.fileName}
                    </a>
                    <button class="view-file-btn" onclick="window.open('${url}', '_blank')">
                        <i class="fas fa-eye"></i> View
                    </button>
                `;
            }

            row.innerHTML = `
                <td>${new Date(submission.timestamp).toLocaleString()}</td>
                <td>${submission.name}</td>
                <td>${submission.email}</td>
                <td>${submission.request}</td>
                <td>${fileCell}</td>
            `;
            tableBody.appendChild(row);
        });

        // Show the viewer
        this.submissionsViewer.style.display = 'flex';
        setTimeout(() => this.submissionsViewer.classList.add('active'), 10);
    }

    hideSubmissions() {
        this.submissionsViewer.classList.remove('active');
        setTimeout(() => this.submissionsViewer.style.display = 'none', 400);
    }

    async readFileAsBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result
                    .replace('data:', '')
                    .replace(/^.+,/, '');
                resolve(base64String);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    base64toBlob(base64Data, contentType = '') {
        const byteCharacters = atob(base64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            const byteNumbers = new Array(slice.length);
            
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            
            byteArrays.push(new Uint8Array(byteNumbers));
        }

        return new Blob(byteArrays, { type: contentType });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FormHandler();
}); 