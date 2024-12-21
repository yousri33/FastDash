class ThemeManager {
    constructor() {
        this.themeToggle = document.querySelector('.theme-toggle');
        this.body = document.body;
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.transitions = false;
        
        this.initialize();
    }

    initialize() {
        // Disable transitions initially
        this.body.style.transition = 'none';
        
        // Set initial theme
        this.setTheme(this.currentTheme);
        
        // Re-enable transitions after initial load
        setTimeout(() => {
            this.body.style.transition = '';
        }, 100);
        
        // Add event listener
        this.themeToggle.addEventListener('click', () => {
            this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
            this.setTheme(this.currentTheme);
            
            // Add animation to theme toggle
            this.themeToggle.classList.add('rotate');
            setTimeout(() => {
                this.themeToggle.classList.remove('rotate');
            }, 300);
        });
    }

    setTheme(theme) {
        this.body.classList.remove('light-mode', 'dark-mode');
        this.body.classList.add(`${theme}-mode`);
        localStorage.setItem('theme', theme);
        
        // Update meta theme color
        document.querySelector('meta[name="theme-color"]')?.setAttribute(
            'content',
            theme === 'dark' ? '#0a0a0f' : '#ffffff'
        );
    }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
}); 