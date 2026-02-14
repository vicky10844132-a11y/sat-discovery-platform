// Router module for SAT-DISCOVERY
// Hash-based page navigation and routing

const Router = {
    routes: {},
    currentRoute: null,
    
    // Initialize router
    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        this.handleRoute();
    },
    
    // Register a route
    register(path, handler) {
        this.routes[path] = handler;
    },
    
    // Handle route change
    handleRoute() {
        const hash = window.location.hash.slice(1) || '/';
        const [path, ...params] = hash.split('/');
        
        this.currentRoute = {
            path: path || '/',
            params: params
        };
        
        // Find matching route
        let handler = this.routes[`/${path}`] || this.routes[path];
        
        // Check for parameterized routes
        if (!handler) {
            for (const route in this.routes) {
                if (route.includes(':')) {
                    const routeParts = route.split('/');
                    const hashParts = hash.split('/');
                    
                    if (routeParts.length === hashParts.length) {
                        let match = true;
                        const params = {};
                        
                        for (let i = 0; i < routeParts.length; i++) {
                            if (routeParts[i].startsWith(':')) {
                                params[routeParts[i].slice(1)] = decodeURIComponent(hashParts[i]);
                            } else if (routeParts[i] !== hashParts[i]) {
                                match = false;
                                break;
                            }
                        }
                        
                        if (match) {
                            handler = this.routes[route];
                            this.currentRoute.params = params;
                            break;
                        }
                    }
                }
            }
        }
        
        if (handler) {
            handler(this.currentRoute);
        } else {
            console.warn('No handler found for route:', hash);
        }
        
        // Update active navigation links
        this.updateNavigation();
    },
    
    // Navigate to a route
    navigate(path) {
        window.location.hash = path;
    },
    
    // Update active navigation links
    updateNavigation() {
        document.querySelectorAll('nav a').forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const linkPath = href.slice(1);
                const currentPath = window.location.hash.slice(1);
                
                if (linkPath === currentPath || 
                    (linkPath && currentPath.startsWith(linkPath))) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        });
    },
    
    // Get current route
    getCurrentRoute() {
        return this.currentRoute;
    },
    
    // Get route parameters
    getParams() {
        return this.currentRoute ? this.currentRoute.params : {};
    }
};

// Make it available globally
window.Router = Router;
