class PricingManager {
    constructor() {
        this.toggle = document.getElementById('billing-toggle');
        this.prices = document.querySelectorAll('.price .amount');
        this.periods = document.querySelectorAll('.price .period');
        
        this.monthlyPrices = ['$0', '$49', '$99'];
        this.yearlyPrices = ['$0', '$470', '$950'];
        
        this.initialize();
    }

    initialize() {
        this.toggle.addEventListener('change', () => {
            const isYearly = this.toggle.checked;
            this.updatePrices(isYearly);
        });
    }

    updatePrices(isYearly) {
        const prices = isYearly ? this.yearlyPrices : this.monthlyPrices;
        const period = isYearly ? '/year' : '/month';
        
        this.prices.forEach((price, index) => {
            price.textContent = prices[index];
        });
        
        this.periods.forEach(periodEl => {
            periodEl.textContent = period;
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PricingManager();
}); 