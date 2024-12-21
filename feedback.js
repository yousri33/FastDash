class FeedbackManager {
    constructor() {
        this.stars = document.querySelectorAll('.rating i');
        this.currentRating = 0;
        this.initialize();
    }

    initialize() {
        this.stars.forEach(star => {
            star.addEventListener('mouseover', () => this.highlightStars(star.dataset.rating));
            star.addEventListener('mouseleave', () => this.highlightStars(this.currentRating));
            star.addEventListener('click', () => this.setRating(star.dataset.rating));
        });
    }

    highlightStars(rating) {
        this.stars.forEach(star => {
            const starRating = parseInt(star.dataset.rating);
            star.classList.toggle('fas', starRating <= rating);
            star.classList.toggle('far', starRating > rating);
        });
    }

    setRating(rating) {
        this.currentRating = rating;
        this.highlightStars(rating);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FeedbackManager();
}); 