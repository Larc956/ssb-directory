const fs = require('fs');
const path = require('path'); // NEW: Required for safely routing folder paths

// OpenStreetMap strictly requires a 1-second delay between requests
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function normalizeCommunityData() {
    console.log("🔍 Starting JavaScript Data Normalization Pipeline...\n");

    // 1. Simulate loading pending community submissions
    const pendingSubmissions = [
        {
            id: 101,
            name: "JSEC Stall 4",
            address: "Ateneo de Manila University, Quezon City", 
            price: 120
        },
        {
            id: 102,
            name: "Cheap Print Hub",
            address: "Fabian de la Rosa St, Loyola Heights, Quezon City",
            price: 5
        }
    ];

    const normalizedData = [];

    // 2. Geocode each submission
    for (const item of pendingSubmissions) {
        console.log(`Checking address: ${item.address}...`);
        
        try {
            const encodedAddress = encodeURIComponent(item.address);
            const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1`;

            const response = await fetch(url, {
                headers: { 'User-Agent': 'SSB_Directory_App_V1' }
            });
            const data = await response.json();

            if (data && data.length > 0) {
                item.latitude = parseFloat(data[0].lat);
                item.longitude = parseFloat(data[0].lon);
                item.status = 'NEEDS_ADMIN_APPROVAL';
                
                normalizedData.push(item);
                console.log(`  ✅ Success: Found [${item.latitude}, ${item.longitude}]`);
            } else {
                item.status = 'MANUAL_FIX_REQUIRED';
                normalizedData.push(item);
                console.log(`  ❌ Failed: Could not locate address. Flagging for manual review.`);
            }
        } catch (error) {
            console.log(`  ⚠️ Error connecting to geocoder: ${error.message}`);
        }

        // CRITICAL: Pause for 1.2 seconds
        await delay(1200);
    }

    // 3. Route the output directly into the public folder
    const outputPath = path.join(__dirname, 'public', 'ready_for_review.json');
    
    fs.writeFileSync(
        outputPath, 
        JSON.stringify(normalizedData, null, 4)
    );
    
    console.log(`\n✨ Normalization Complete! Saved directly to: /public/ready_for_review.json`);
}

// Run the function
normalizeCommunityData();