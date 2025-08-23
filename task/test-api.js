// Test file to demonstrate API usage
// You can run this in the browser console or as a Node.js script

const API_BASE = 'http://localhost:3001/api';

// Test 1: Register a new user
async function testRegister() {
  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser123',
        password: 'password123',
        role: 'User'
      })
    });
    
    const data = await response.json();
    console.log('Register Response:', data);
    return data;
  } catch (error) {
    console.error('Register Error:', error);
  }
}

// Test 2: Login user
async function testLogin() {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser123',
        password: 'password123'
      })
    });
    
    const data = await response.json();
    console.log('Login Response:', data);
    
    // Store token for future requests
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
    
    return data;
  } catch (error) {
    console.error('Login Error:', error);
  }
}

// Test 3: Get articles
async function testGetArticles() {
  try {
    const token = localStorage.getItem('authToken');
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Add Authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE}/articles?page=1&limit=5`, {
      method: 'GET',
      headers
    });
    
    const data = await response.json();
    console.log('Articles Response:', data);
    return data;
  } catch (error) {
    console.error('Get Articles Error:', error);
  }
}

// Run all tests in sequence
async function runAllTests() {
  console.log('=== Starting API Tests ===');
  
  console.log('\n1. Testing Registration...');
  await testRegister();
  
  console.log('\n2. Testing Login...');
  await testLogin();
  
  console.log('\n3. Testing Get Articles...');
  await testGetArticles();
  
  console.log('\n=== Tests Completed ===');
}

// Export functions for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testRegister, testLogin, testGetArticles, runAllTests };
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
  console.log('API test functions loaded. Run runAllTests() to test all endpoints.');
}
