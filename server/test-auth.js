/**
 * Simple authentication test script
 * Tests login for Garv and Mihir admin accounts
 */

const API_BASE = 'http://localhost:5000/api';

async function testLogin(email, password) {
  try {
    console.log(`\n🔐 Testing login for: ${email}`);
    
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Login successful!');
      console.log('User:', data.user);
      console.log('Token:', data.token.substring(0, 50) + '...');
      return data.token;
    } else {
      console.log('❌ Login failed:', data.error);
      return null;
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    return null;
  }
}

async function testProfile(token) {
  try {
    console.log('\n👤 Testing profile endpoint...');
    
    const response = await fetch(`${API_BASE}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Profile retrieved successfully!');
      console.log('Profile:', data.user);
    } else {
      console.log('❌ Profile retrieval failed:', data.error);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

async function testRegister() {
  try {
    console.log('\n📝 Testing registration...');
    
    const testUser = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'test123456',
    };

    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Registration successful!');
      console.log('New user:', data.user);
    } else {
      console.log('❌ Registration failed:', data.error);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

async function runTests() {
  console.log('========================================');
  console.log('SafeRoad AI Authentication Tests');
  console.log('========================================');

  // Test Garv login
  const garvToken = await testLogin('garv@saferoad.ai', 'garv@admin2026');
  if (garvToken) {
    await testProfile(garvToken);
  }

  // Test Mihir login
  const mihirToken = await testLogin('mihir@saferoad.ai', 'mihir@admin2026');
  if (mihirToken) {
    await testProfile(mihirToken);
  }

  // Test registration
  await testRegister();

  // Test invalid login
  await testLogin('invalid@email.com', 'wrongpassword');

  console.log('\n========================================');
  console.log('Tests completed!');
  console.log('========================================\n');
}

// Run tests
runTests();
