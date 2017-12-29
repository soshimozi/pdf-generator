module.exports = {
        apps: [
          {
                name: "pdfgenerator-api",
                script: "./appserver/server.js",
                watch: true,
                env: {
                        "NODE_ENV": "production",
                        "NODE_PORT": "8080"
                }
        }]
};
