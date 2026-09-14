const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");

const root = __dirname;
const port = Number(process.env.PORT || 8000);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".pdf": "application/pdf",
  ".ico": "image/x-icon",
};

const server = http.createServer(async (req, res) => {
  if (!["GET", "HEAD"].includes(req.method)) {
    res.writeHead(405, { Allow: "GET, HEAD" });
    return res.end("Method not allowed");
  }
  try {
    const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    const relative = pathname === "/" ? "index.html" : pathname.slice(1);
    // Serve only public portfolio files, never local scripts or hidden folders.
    if (relative.includes("\\") || relative.includes("\0") ||
        relative.split("/").some(part => part.startsWith(".")) ||
        !(relative === "index.html" || /^(css|js|sections|data|assets)\//.test(relative))) {
      res.writeHead(404);
      return res.end("Not found");
    }
    const file = path.resolve(root, relative);
    const realFile = await fs.realpath(file);
    if (!realFile.startsWith(root + path.sep) || !(await fs.stat(realFile)).isFile()) {
      res.writeHead(404);
      return res.end("Not found");
    }
    const content = await fs.readFile(realFile);
    res.writeHead(200, {
      "Content-Type": types[path.extname(file).toLowerCase()] || "application/octet-stream",
      "Content-Length": content.length,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
    res.end(req.method === "HEAD" ? undefined : content);
  } catch (error) {
    const status = error instanceof URIError ? 400 : ["ENOENT", "ENOTDIR"].includes(error.code) ? 404 : 500;
    res.writeHead(status);
    res.end(status === 400 ? "Bad request" : status === 404 ? "Not found" : "Unable to serve file");
  }
});

server.on("error", error => {
  console.error(error.code === "EADDRINUSE"
    ? `Port ${port} is already in use. Set PORT to another port and run npm start again.`
    : error.message);
  process.exitCode = 1;
});
server.listen(port, "127.0.0.1", () => {
  console.log(`Portfolio running at http://localhost:${port}`);
  console.log("Press Ctrl+C to stop. Refresh the browser after editing files.");
});
