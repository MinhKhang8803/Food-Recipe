const bcrypt = require('bcrypt');

const testPassword = async () => {
    const password = 'password';  // Use the correct password for comparison
    const hashedPassword = '$2a$10$f8emwyvA0wV2r6FmPU15YuoxKUizskJcson4SLrnGoZx81fRdV59O';  // Use the hash from MongoDB

    const isMatch = await bcrypt.compare(password, hashedPassword);
    console.log('Password comparison result:', isMatch); // Should print true
};

testPassword();
