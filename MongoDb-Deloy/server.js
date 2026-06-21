const http = require("http");
const https = require("https");
const fs = require("fs");

const app = require("./app");

const PORT = process.env.PORT || 3000;

// Render automatically sets process.env.RENDER to "true"
const isRender = process.env.RENDER === "true";

if (isRender) {
    // Render reverse proxy handles HTTPS, so our application should bind to HTTP internally
    http.createServer(app).listen(PORT, () => {
        console.log(`HTTP Server running on port ${PORT} (Render HTTPS termination handles SSL)`);
    });
} else {
    try {
        const options = {
            key: fs.readFileSync("./key.pem"),
            cert: fs.readFileSync("./cert.pem")
        };
        https.createServer(options, app).listen(PORT, () => {
            console.log(`HTTPS Server running at https://localhost:${PORT}`);
        });
    } catch (err) {
        console.warn("Could not find key.pem or cert.pem. Falling back to HTTP:", err.message);
        http.createServer(app).listen(PORT, () => {
            console.log(`HTTP Server running at http://localhost:${PORT}`);
        });
    }
}