// Quick test script to verify API is working
const testSignup = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'testuser123',
                email: 'testuser123@example.com',
                password: 'Test123456'
            })
        });

        const data = await response.json();
        console.log('Response status:', response.status);
        console.log('Response data:', JSON.stringify(data, null, 2));

        if (response.ok) {
            console.log('✅ SUCCESS! Signup working correctly');
        } else {
            console.log('❌ ERROR:', data.message || 'Unknown error');
            if (data.errors) {
                console.log('Validation errors:', data.errors);
            }
        }
    } catch (error) {
        console.log('❌ FETCH ERROR:', error.message);
    }
};

testSignup();
