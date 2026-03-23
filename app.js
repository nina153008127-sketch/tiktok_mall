const express = require("express");
const app = express();

// يخلي السيرفر يقرأ ملفات HTML من public
app.use(express.static("public"));

// الصفحة الرئيسية
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/register.html");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running");
});