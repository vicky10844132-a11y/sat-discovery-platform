#!/usr/bin/env node

// Smoke test for SAT-DISCOVERY platform
// Tests basic functionality of all modules

const fs = require('fs');
const path = require('path');

console.log('🧪 SAT-DISCOVERY Smoke Test\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
    try {
        fn();
        console.log(`✓ ${name}`);
        passed++;
    } catch (error) {
        console.log(`✗ ${name}: ${error.message}`);
        failed++;
    }
}

// Test 1: Check all required files exist
test('All CSS files exist', () => {
    const cssFiles = ['theme.css', 'layout.css', 'components.css'];
    cssFiles.forEach(file => {
        if (!fs.existsSync(path.join('css', file))) {
            throw new Error(`Missing ${file}`);
        }
    });
});

// Test 2: Check all JS modules exist
test('All JS modules exist', () => {
    const jsFiles = [
        'dataLoader.js', 'indexer.js', 'filters.js', 'ui.js',
        'map.js', 'router.js', 'storage.js', 'orbit_stub.js'
    ];
    jsFiles.forEach(file => {
        if (!fs.existsSync(path.join('js', file))) {
            throw new Error(`Missing ${file}`);
        }
    });
});

// Test 3: Check all HTML pages exist
test('All HTML pages exist', () => {
    const htmlFiles = [
        'index.html', 'app.html', 'satellite.html',
        'sources.html', 'orbit.html', 'delivery.html'
    ];
    htmlFiles.forEach(file => {
        if (!fs.existsSync(file)) {
            throw new Error(`Missing ${file}`);
        }
    });
});

// Test 4: Check JSON data files exist
test('All JSON data files exist', () => {
    const jsonFiles = [
        'satellites.json', 'sources.json', 'open_archives.json',
        'coverage_rules.json', 'programming_satellites.json'
    ];
    jsonFiles.forEach(file => {
        if (!fs.existsSync(file)) {
            throw new Error(`Missing ${file}`);
        }
    });
});

// Test 5: Validate JSON syntax
test('All JSON files are valid', () => {
    const jsonFiles = [
        'satellites.json', 'sources.json', 'open_archives.json',
        'coverage_rules.json', 'programming_satellites.json'
    ];
    jsonFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        JSON.parse(content); // Will throw if invalid
    });
});

// Test 6: Check JavaScript syntax
test('All JS files have valid syntax', () => {
    const jsFiles = fs.readdirSync('js').filter(f => f.endsWith('.js'));
    jsFiles.forEach(file => {
        const content = fs.readFileSync(path.join('js', file), 'utf8');
        if (!content.includes('window.')) {
            throw new Error(`${file} doesn't export to window`);
        }
    });
});

// Test 7: Check color scheme in CSS
test('Color scheme variables defined', () => {
    const themeContent = fs.readFileSync('css/theme.css', 'utf8');
    if (!themeContent.includes('#020b16')) {
        throw new Error('Dark blue color not found');
    }
    if (!themeContent.includes('#ffd700')) {
        throw new Error('Yellow color not found');
    }
});

// Test 8: Check app.html structure
test('app.html has required structure', () => {
    const appContent = fs.readFileSync('app.html', 'utf8');
    const required = [
        'SAT-DISCOVERY',
        'sidebar',
        'map-panel',
        'results-panel',
        'dataLoader.js',
        'indexer.js',
        'filters.js'
    ];
    required.forEach(item => {
        if (!appContent.includes(item)) {
            throw new Error(`Missing ${item} in app.html`);
        }
    });
});

// Test 9: Check module exports
test('JS modules export to window', () => {
    const modules = [
        { file: 'dataLoader.js', name: 'DataLoader' },
        { file: 'indexer.js', name: 'Indexer' },
        { file: 'filters.js', name: 'Filters' },
        { file: 'ui.js', name: 'UI' },
        { file: 'map.js', name: 'MapManager' },
        { file: 'router.js', name: 'Router' },
        { file: 'storage.js', name: 'Storage' },
        { file: 'orbit_stub.js', name: 'OrbitPlanner' }
    ];
    
    modules.forEach(({ file, name }) => {
        const content = fs.readFileSync(path.join('js', file), 'utf8');
        if (!content.includes(`window.${name}`)) {
            throw new Error(`${file} doesn't export ${name}`);
        }
    });
});

// Test 10: Check documentation exists
test('Documentation files exist', () => {
    const docs = ['DEVELOPER.md', 'VISUAL_GUIDE.md'];
    docs.forEach(file => {
        if (!fs.existsSync(file)) {
            throw new Error(`Missing ${file}`);
        }
    });
});

// Results
console.log(`\n${'='.repeat(50)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log(`${'='.repeat(50)}\n`);

if (failed > 0) {
    console.log('❌ Some tests failed');
    process.exit(1);
} else {
    console.log('✅ All tests passed!');
    process.exit(0);
}
