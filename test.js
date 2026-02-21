async function test() {
    const res = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            fullName: 'New User',
            email: 'newuser9991234@example.com',
            password: 'password123',
            role: 'patient'
        })
    });
    const data = await res.json();
    console.log(data);
}

test();
