// js/router.js

// A simple hash-based routing system

class Router {
    constructor() {
        this.routes = {};
        this.currentUrl = '';
    }

    addRoute(path, callback) {
        this.routes[path] = callback;
    }

    route() {
        const hash = window.location.hash.replace('#', '');
        this.currentUrl = hash;
        const route = this.routes[this.currentUrl];
        if (route) {
            route();
        } else {
            console.warn(`No route found for ${this.currentUrl}`);
        }
    }

    init() {
        window.addEventListener('hashchange', () => this.route());
        window.addEventListener('load', () => this.route());
    }
}

// Example usage:
const router = new Router();

router.addRoute('home', () => {
    console.log('You are at the home page');
});

router.addRoute('about', () => {
    console.log('You are at the about page');
});

// Initialize the router
router.init();
