class AnimationHandler {
    constructor() {
        this.observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        this.initialize();
    }

    initialize() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    this.observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);

        // Observe all sections
        document.querySelectorAll('section').forEach(section => {
            this.observer.observe(section);
        });
    }
}

// Initialize animation handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AnimationHandler();
}); 