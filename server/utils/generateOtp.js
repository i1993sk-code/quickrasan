const generateOtp = () => {
    // 6 digit ka random number
    return Math.floor(Math.random() * 900000) + 100000; 
};

export default generateOtp;