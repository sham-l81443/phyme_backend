const customEncoder = ({ text, }: { text: string }) => {
    const key = process.env.ENCRYPTION_KEY || "MySecretKey";
    let encoded = "";
    for (let i = 0; i < text.length; i++) {
        encoded += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return Buffer.from(encoded).toString("base64");
};



export default customEncoder  