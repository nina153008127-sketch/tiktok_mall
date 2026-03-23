const express = require("express");
const app = express();

// يخلي السيرفر يقرأ ملفات HTML
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running");
});