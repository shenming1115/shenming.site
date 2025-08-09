// Website Functionality Checker
export function runFullCheck() {
    console.log('🔍 Running complete functionality check...');
    
    const results = {
        files: checkFiles(),
        styles: checkStyles(),
        scripts: checkScripts(),
        images: checkImages(),
        seo: checkSEO(),
        performance: checkPerformance()
    };
    
    displayResults(results);
    return results;
}

function checkFiles() {
    const requiredFiles = [
        'index.html',
        'css/main.css',
        'js/main.js',
        'sitemap.xml',
        'robots.txt',
        'site.webmanifest',
        'favicon.svg'
    ];
    
    const results = [];
    
    requiredFiles.forEach(file => {
        fetch(file)
            .then(response => {
                if (response.ok) {
                    results.push({ file, status: 'ok', message: 'File exists' });
                } else {
                    results.push({ file, status: 'error', message: 'File not found' });
                }
            })
            .catch(() => {
                results.push({ file, status: 'error', message: 'File not accessible' });
            });
    });
    
    return results;
}

function checkStyles() {
    const results = [];
    
    // Check if CSS variables are defined
    const rootStyles = getComputedStyle(document.documentElement);
    const cssVars = [
        '--primary',
        '--secondary', 
        '--accent',
        '--text-primary',
        '--bg-light'
    ];
    
    cssVars.forEach(varName => {
        const value = rootStyles.getPropertyValue(varName);
        if (value) {
            results.push({ 
                item: varName, 
                status: 'ok', 
                message: `Value: ${value.trim()}` 
            });
        } else {
            results.push({ 
                item: varName, 
                status: 'error', 
                message: 'CSS variable not defined' 
            });
        }
    });
    
    return results;
}

function checkScripts() {
    const results = [];
    
    // Check if main modules are loaded
    const modules = [
        'initializeUI',
        'initializeAnalytics', 
        'initializeTetris',
        'initializeSecurity'
    ];
    
    modules.forEach(moduleName => {
        if (typeof window[moduleName] === 'function') {
            results.push({ 
                module: moduleName, 
                status: 'ok', 
                message: 'Module loaded' 
            });
        } else {
            results.push({ 
                module: moduleName, 
                status: 'warning', 
                message: 'Module not found in global scope' 
            });
        }
    });
    
    return results;
}

function checkImages() {
    const results = [];
    const images = document.querySelectorAll('img');
    
    images.forEach((img, index) => {
        if (img.complete && img.naturalHeight !== 0) {
            results.push({ 
                image: `Image ${index + 1}`, 
                status: 'ok', 
                message: `Loaded: ${img.src}` 
            });
        } else {
            results.push({ 
                image: `Image ${index + 1}`, 
                status: 'error', 
                message: `Failed to load: ${img.src}` 
            });
        }
    });
    
    return results;
}

function checkSEO() {
    const results = [];
    
    // Check meta tags
    const metaTags = [
        { name: 'title', selector: 'title' },
        { name: 'description', selector: 'meta[name="description"]' },
        { name: 'keywords', selector: 'meta[name="keywords"]' },
        { name: 'og:title', selector: 'meta[property="og:title"]' },
        { name: 'og:description', selector: 'meta[property="og:description"]' }
    ];
    
    metaTags.forEach(tag => {
        const element = document.querySelector(tag.selector);
        if (element) {
            const content = element.content || element.textContent;
            results.push({ 
                tag: tag.name, 
                status: 'ok', 
                message: `Present: ${content.substring(0, 50)}...` 
            });
        } else {
            results.push({ 
                tag: tag.name, 
                status: 'error', 
                message: 'Meta tag missing' 
            });
        }
    });
    
    return results;
}

function checkPerformance() {
    const results = [];
    
    if (window.performance) {
        const navigation = performance.getEntriesByType('navigation')[0];
        
        if (navigation) {
            const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
            const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
            
            results.push({
                metric: 'Page Load Time',
                status: loadTime < 3000 ? 'ok' : 'warning',
                message: `${loadTime.toFixed(0)}ms`
            });
            
            results.push({
                metric: 'DOM Content Loaded',
                status: domContentLoaded < 1500 ? 'ok' : 'warning', 
                message: `${domContentLoaded.toFixed(0)}ms`
            });
        }
    }
    
    return results;
}

function displayResults(results) {
    console.group('🔍 Website Functionality Check Results');
    
    Object.keys(results).forEach(category => {
        console.group(`📋 ${category.toUpperCase()}`);
        
        results[category].forEach(result => {
            const icon = result.status === 'ok' ? '✅' : 
                        result.status === 'warning' ? '⚠️' : '❌';
            
            console.log(`${icon} ${Object.values(result)[0]}: ${result.message}`);
        });
        
        console.groupEnd();
    });
    
    console.groupEnd();
    
    // Summary
    const totalChecks = Object.values(results).reduce((sum, category) => sum + category.length, 0);
    const passedChecks = Object.values(results).reduce((sum, category) => 
        sum + category.filter(item => item.status === 'ok').length, 0);
    
    console.log(`📊 Summary: ${passedChecks}/${totalChecks} checks passed`);
    
    if (passedChecks === totalChecks) {
        console.log('🎉 All checks passed! Website is fully functional.');
    } else {
        console.log('⚠️ Some issues found. Check the details above.');
    }
}

// Auto-run check when module loads
if (typeof window !== 'undefined') {
    window.runFullCheck = runFullCheck;
}