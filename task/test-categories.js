// Simple test script to check the categories API response
const axios = require('axios');

async function testCategoriesAPI() {
    try {
        // You'll need to replace this with a valid token from your app
        const token = 'YOUR_AUTH_TOKEN_HERE';
        
        const response = await axios.get('https://test-fe.mysellerpintar.com/api/categories', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Full API Response:', JSON.stringify(response.data, null, 2));
        
        if (Array.isArray(response.data)) {
            console.log('Response is an array');
            response.data.forEach((item, index) => {
                console.log(`Item ${index}:`, item);
                console.log(`Item ${index} keys:`, Object.keys(item));
            });
        } else {
            console.log('Response is an object');
            console.log('Response keys:', Object.keys(response.data));
            if (response.data.data && Array.isArray(response.data.data)) {
                console.log('Categories in response.data.data:');
                response.data.data.forEach((item, index) => {
                    console.log(`Category ${index}:`, item);
                    console.log(`Category ${index} keys:`, Object.keys(item));
                });
            }
        }
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

// Note: This is just for testing - run this with a valid token
console.log('Test script created. You need to add a valid auth token to run this.');
