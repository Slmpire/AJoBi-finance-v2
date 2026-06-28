const axios = require('axios');

async function testRegister() {
  try {
    const response = await axios.post('https://ajobi-643447426952.europe-west1.run.app/api/auth/register', {
      full_name: "Test User",
      phone: "08012345678",
      password: "password123",
      email: "test@example.com"
    });
    console.log("SUCCESS");
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log("ERROR");
    if (error.response) {
      console.log(JSON.stringify(error.response.data, null, 2));
    } else {
      console.log(error.message);
    }
  }
}

testRegister();
