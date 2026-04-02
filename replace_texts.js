const fs = require('fs');
const path = require('path');

const filePaths = [
    'TECH_STACK.md',
    'frontend/index.html',
    'frontend/src/pages/Home.jsx',
    'frontend/src/components/VirtualTryOn.jsx',
    'frontend/src/components/Footer.jsx',
    'frontend/src/components/AuthModal.jsx',
    'backend/server.js',
    'backend/routes/auth.js',
    'backend/data/products.json',
    'backend/data/banners.json',
    'backend/package.json',
    'frontend/package.json'
];

filePaths.forEach(file => {
    const fullPath = path.join(__dirname, file);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf-8');
        
        // Extract all instances of static URLs to protect them
        const extractUrlMatch = content.match(/static1?\.lenskart\.com/gi) || [];
        
        let placeholderIndex = 0;
        content = content.replace(/static1?\.lenskart\.com/gi, () => `___URL_${placeholderIndex++}___`);

        // Change 'support@lenskart.com' explicitly
        content = content.replace(/support@lenskart\.com/g, 'support@spectsmart.com');
        content = content.replace(/support@spectsmart\.com/g, 'support@spectsmart.com'); // in case it was already lenskart

        // Replace Lenskart text
        content = content.replace(/Lenskart\b/g, 'SpectsMart');
        content = content.replace(/lenskart\b/g, 'spectsmart');
        content = content.replace(/LENSKART\b/g, 'SPECTSMART');

        // Handle possible camelCasings implicitly
        content = content.replace(/lenskartGold/g, 'spectsmartGold'); 
        
        content = content.replace(/LenskartGold/g, 'SpectsMartGold');

        // Replace "Best Vision Opticals" and "Best Opticals"
        content = content.replace(/Best Vision Opticals/gi, 'SpectsMart');
        content = content.replace(/Best Opticals/gi, 'SpectsMart');
        content = content.replace(/BEST VISION/g, 'SPECTSMART');

        // Restore static URLs
        placeholderIndex = 0;
        content = content.replace(/___URL_\d+___/g, () => extractUrlMatch[placeholderIndex++]);

        // Fix favicon logo in index.html specifically if it hasn't been extracted
        if (file === 'frontend/index.html') {
            content = content.replace(
                /<link .*href="https:\/\/static.lenskart.com\/media\/desktop\/img\/site-images\/main-logo.png".*>/i,
                '<link rel="icon" type="image/png" href="https://res.cloudinary.com/dhpfphivh/image/upload/v1775127135/ChatGPT_Image_Apr_2__2026__04_18_20_PM-removebg-preview_jrgzgo.png" />'
            );
        }

        fs.writeFileSync(fullPath, content, 'utf-8');
        console.log(`Updated ${file}`);
    }
});
