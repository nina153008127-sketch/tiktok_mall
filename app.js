const express = require("express");
const app = express();

app.use(express.json());

let users = [];

// ================= REGISTER API =================
app.post("/register", (req, res) => {
    const { email, password, code } = req.body;

    if (code !== "123123") {
        return res.send("Invalid invite code");
    }

    users.push({ email, password, balance: 100 });
    res.send("User registered successfully");
});

// ================= LOGIN API =================
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.json({ error: "User not found" });
    }

    res.json(user);
});

// ================= REGISTER PAGE =================
app.get("/register-page", (req, res) => {
res.send(`<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body {
background:black;
color:white;
font-family:Arial;
display:flex;
justify-content:center;
align-items:center;
height:100vh;
margin:0;
}
.box {
background:#111;
padding:30px;
border-radius:20px;
box-shadow:0 0 30px #00f2ea;
width:300px;
text-align:center;
}
.logo {
font-size:40px;
font-weight:bold;
background: linear-gradient(45deg,#00f2ea,#ff0050);
-webkit-background-clip: text;
color: transparent;
margin-bottom:20px;
}
input {
width:100%;
padding:12px;
margin:10px 0;
border:none;
border-radius:10px;
background:#222;
color:white;
}
button {
width:100%;
padding:12px;
border:none;
border-radius:10px;
background: linear-gradient(45deg,#00f2ea,#ff0050);
color:white;
font-size:16px;
}
a {
color:red;
text-decoration:none;
}
</style>
</head>
<body>
<div class="box">
<div class="logo">Tik Tok Mall</div>
<h2>Register</h2>
<input id="email" placeholder="Email">
<input id="password" type="password" placeholder="Password">
<input id="code" placeholder="Invite Code">
<button onclick="register()">Register</button>
<br><br>
<a href="/login-page">Go to Login</a>
</div>
<script>
function register(){
fetch("/register",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
email:email.value,
password:password.value,
code:code.value
})
})
.then(res=>res.text())
.then(data=>{
alert(data);
window.location.href="/login-page";
})
}
</script>
</body>
</html>`);
});

// ================= LOGIN PAGE =================
app.get("/login-page", (req, res) => {
res.send(`<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body {
background:black;
color:white;
font-family:Arial;
display:flex;
justify-content:center;
align-items:center;
height:100vh;
margin:0;
}
.box {
background:#111;
padding:30px;
border-radius:20px;
box-shadow:0 0 30px #ff0050;
width:300px;
text-align:center;
}
.logo {
font-size:40px;
font-weight:bold;
background: linear-gradient(45deg,#00f2ea,#ff0050);
-webkit-background-clip: text;
color: transparent;
margin-bottom:20px;
}
input {
width:100%;
padding:12px;
margin:10px 0;
border:none;
border-radius:10px;
background:#222;
color:white;
}
button {
width:100%;
padding:12px;
border:none;
border-radius:10px;
background: linear-gradient(45deg,#00f2ea,#ff0050);
color:white;
font-size:16px;
}
a {
color:red;
text-decoration:none;
}
</style>
</head>
<body>
<div class="box">
<div class="logo">Tik Tok Mall</div>
<h2>Login</h2>
<input id="email" placeholder="Email">
<input id="password" type="password" placeholder="Password">
<button onclick="login()">Login</button>
<br><br>
<a href="/register-page">Create new account</a>
</div>
<script>
function login(){
fetch("/login",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
email:email.value,
password:password.value
})
})
.then(res=>res.json())
.then(data=>{
if(data.email){
localStorage.setItem("user", JSON.stringify(data));
window.location.href="/dashboard";
}else{
alert("Login failed");
}
})
}
</script>
</body>
</html>`);
});

// ================= DASHBOARD (WITH ACCOUNT + LANGUAGE) =================
app.get("/dashboard", (req, res) => {
res.send(`<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body{margin:0;font-family:Arial;background:#f5f5f5;}
.header{background:#1976d2;color:white;padding:12px;display:flex;justify-content:space-between;align-items:center;}
.header .icons span{margin-left:10px;font-size:18px;cursor:pointer;}
.logo{text-align:center;font-size:26px;font-weight:bold;margin:10px 0;letter-spacing:1px;color:white;text-shadow:2px 2px 0 #ff0050,-2px -2px 0 #00f2ea;}
.section-title{text-align:center;margin:15px 0;font-weight:bold;}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:10px;}
.card{background:white;border-radius:10px;overflow:hidden;}
.card img{width:100%;height:120px;object-fit:cover;}
.card button{width:100%;padding:8px;border:none;background:#28a745;color:white;}
.banner{background:white;margin:10px;padding:20px;text-align:center;border-radius:10px;}
</style>
</head>

<body>

<div class="header">
<div onclick="openMenuPage()" style="cursor:pointer;">☰ Shop</div>
<div class="icons">
<span onclick="toggleSearch()">🔍</span>
<span onclick="toggleMessages()">✉️</span>
<span onclick="toggleAccount()">👤</span>
<span onclick="toggleLang()">🌐</span>
</div>
</div>

<!-- ACCOUNT MENU -->
<div id="accountMenu" style="display:none;position:fixed;top:50px;left:0;width:100%;height:100%;background:#f5f5f5;z-index:999;overflow:auto;">
<div style="background:#ddd;padding:20px;text-align:center;">
<div style="font-size:60px;">👤</div>
<p>Hi</p>
<p id="userInfo"></p>
</div>

<div style="background:white;margin-top:5px;">
<p style="padding:12px;border-bottom:1px solid #ccc;cursor:pointer;" onclick="openOrders()">📋 My Order</p>
<p style="padding:12px;border-bottom:1px solid #ccc;cursor:pointer;" onclick="openWallet()">💰 Wallet</p>
<p style="padding:12px;border-bottom:1px solid #ccc;cursor:pointer;" onclick="openHistory()">🕒 Search History</p>
<p style="padding:12px;border-bottom:1px solid #ccc;cursor:pointer;" onclick="openFav()">❤️ My Favorite</p>
<p style="padding:12px;border-bottom:1px solid #ccc;cursor:pointer;" onclick="openSupport()">🎧 Customer Service</p>
<p style="padding:12px;border-bottom:1px solid #ccc;cursor:pointer;" onclick="openMerchant()">🏪 Merchant</p>
</div>

<div style="background:white;margin-top:10px;">
<p style="padding:12px;border-bottom:1px solid #ccc;cursor:pointer;" onclick="openAddress()">📍 Address</p>
<p style="padding:12px;border-bottom:1px solid #ccc;cursor:pointer;" onclick="openEmail()">✉️ Manage Email</p>
</div>

<div style="background:white;margin-top:10px;">
<p style="padding:12px;border-bottom:1px solid #ccc;cursor:pointer;" onclick="openPassword()">🔒 Account Password</p>
<p style="padding:12px;border-bottom:1px solid #ccc;cursor:pointer;" onclick="openTransaction()">🔑 Transaction Password</p>
</div>

<div style="background:white;margin-top:10px;">
<p style="padding:12px;border-bottom:1px solid #ccc;">🌐 Language</p>
<p style="padding:12px;" onclick="logout()">🚪 Log out</p>
</div>
</div>

<!-- LANGUAGE MENU -->
<!-- SEARCH MENU -->
<!-- MESSAGES MENU -->
<!-- MENU PAGE -->
<div id="menuPage" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:#eee;z-index:9999;overflow:auto;">

<!-- HEADER -->
<div style="background:#1976d2;color:white;padding:15px;display:flex;align-items:center;gap:10px;">
<span onclick="closeMenuPage()" style="font-size:20px;cursor:pointer;">←</span>
<h3 style="margin:0;">Menu</h3>
</div>

<!-- CONTENT -->

<div style="background:#ddd;padding:15px;font-weight:bold;">HOME</div>

<div style="background:black;color:white;text-align:center;padding:35px;margin:10px;">
Get up to 30% off!
</div>

<div style="background:#ddd;margin:10px;padding:20px;display:flex;justify-content:space-between;align-items:center;">
<span>Clothing & Accessories</span>
<img src="https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg" width="70">
</div> 

<div style="background:#ddd;margin:10px;padding:20px;display:flex;justify-content:space-between;align-items:center;">
<span>Medical Bags and Sunglasses</span>
<img src="https://images.unsplash.com/photo-1585386959984-a4155224a1ad" width="70">
</div>

<div style="background:#ddd;margin:10px;padding:20px;display:flex;justify-content:space-between;align-items:center;">
<span>Shoes</span>
<img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff" width="70">
</div>

<div style="background:#ddd;margin:10px;padding:20px;display:flex;justify-content:space-between;align-items:center;">
<span>Watches</span>
<img <img src="https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg" width="70">
</div>

<div style="background:#ddd;margin:10px;padding:20px;display:flex;justify-content:space-between;align-items:center;">
<span>Jewelry</span>
<img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338" width="70">
</div>

<div style="background:#ddd;margin:10px;padding:20px;display:flex;justify-content:space-between;align-items:center;">
<span>Electronics</span>
<img src="https://images.unsplash.com/photo-1518770660439-4636190af475" width="70">
</div>

<div style="background:#ddd;margin:10px;padding:20px;display:flex;justify-content:space-between;align-items:center;">
<span>Smart Home</span>
<img src="https://images.unsplash.com/photo-1558002038-1055907df827" width="70">
</div>

<div style="background:#ddd;margin:10px;padding:20px;display:flex;justify-content:space-between;align-items:center;">
<span>Luxury Brands</span>
<img src="https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg" width="70">
</div>

<div style="background:#ddd;margin:10px;padding:20px;display:flex;justify-content:space-between;align-items:center;">
<span>Beauty and Personal Care</span>
<img src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9" width="70">
</div>

<div style="background:#ddd;margin:10px;padding:20px;display:flex;justify-content:space-between;align-items:center;">
<span>Men's Fashion</span>
<img src="https://images.unsplash.com/photo-1516826957135-700dedea698c" width="70">
</div>

<div style="background:#ddd;margin:10px;padding:20px;display:flex;justify-content:space-between;align-items:center;">
<span>Health and Household</span>
<img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952" width="70">
</div>

<div style="background:#ddd;margin:10px;padding:20px;display:flex;justify-content:space-between;align-items:center;">
<span>Home and Kitchen</span>
<img src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f" width="70">
</div>

<div style="background:black;color:white;text-align:center;font-size:40px;padding:20px;margin-top:10px;">
TOPSHOP
</div>

<div style="background:white;padding:15px;">
<p>Hi, user <a href="#" onclick="logout()">Log out</a></p>
<hr>
<p>👤 My account</p>
<p>📋 My Order</p>
<p>💰 Wallet</p>
</div>

</div>
<div id="messagesMenu" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:#f5f5f5;z-index:9999;overflow:auto;">

<div style="padding:15px;display:flex;align-items:center;gap:10px;background:#1976d2;color:white;">
<span onclick="toggleMessages()" style="font-size:20px;cursor:pointer;">←</span>
<h3 style="margin:0;">Messages</h3>
</div>

<div id="messagesList" style="padding:15px;"></div>

<div style="text-align:center;margin-top:50px;color:#999;">
<p>📭</p>
<p>No Messages</p>
</div>

</div>
<div id="searchMenu" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:#eee;z-index:9999;overflow:auto;">

<div style="padding:15px;display:flex;align-items:center;gap:10px;">
<span onclick="toggleSearch()" style="font-size:20px;cursor:pointer;">←</span>
<div style="flex:1;display:flex;align-items:center;background:white;border-radius:30px;padding:10px;">
<span style="margin-right:10px;">Store ▼</span>
<input id="searchInput" placeholder="Search for Product, Store" style="border:none;outline:none;width:100%;">
</div>
</div>

<div style="padding:15px;">
<h3>Search History</h3>
<div id="historyList" style="color:#555;"></div>
</div>

<div style="text-align:center;margin-top:50px;color:#aaa;">
<p>📄</p>
<p>No Search History</p>
</div>

</div>
<div id="langMenu" style="display:none;position:fixed;top:50px;left:0;width:100%;background:white;z-index:999;">
<p onclick="setLang('en')" style="padding:12px;border-bottom:1px solid #ccc;text-align:center;">English</p>
<p onclick="setLang('ar')" style="padding:12px;border-bottom:1px solid #ccc;text-align:center;">عربي</p>
<p onclick="setLang('cn')" style="padding:12px;border-bottom:1px solid #ccc;text-align:center;">简体中文</p>
<p onclick="setLang('tw')" style="padding:12px;border-bottom:1px solid #ccc;text-align:center;">繁體中文</p>
<p onclick="setLang('jp')" style="padding:12px;border-bottom:1px solid #ccc;text-align:center;">日本語</p>
<p onclick="setLang('kr')" style="padding:12px;border-bottom:1px solid #ccc;text-align:center;">한국인</p>
<p onclick="setLang('es')" style="padding:12px;border-bottom:1px solid #ccc;text-align:center;">Español</p>
<p onclick="setLang('fr')" style="padding:12px;border-bottom:1px solid #ccc;text-align:center;">Français</p>
<p onclick="setLang('vi')" style="padding:12px;border-bottom:1px solid #ccc;text-align:center;">Tiếng Việt</p>
<p onclick="setLang('it')" style="padding:12px;border-bottom:1px solid #ccc;text-align:center;">Italiano</p>
<p onclick="setLang('de')" style="padding:12px;border-bottom:1px solid #ccc;text-align:center;">Deutsch</p>
<p onclick="setLang('th')" style="padding:12px;border-bottom:1px solid #ccc;text-align:center;">แบบไทย</p>
<p onclick="setLang('hi')" style="padding:12px;text-align:center;">हिन्दी</p>
</div>

<div class="logo">TikTok Mall</div>

<div class="section-title">Classified</div>

<div class="grid" id="products"></div>

<div class="card">
<img src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796">
<button onclick="buy(20)">Buy $20</button>
</div>
</div>

<div class="banner">
<div class="logo">TikTok Mall</div>
<p>Best Shopping Experience</p>
</div>

<div class="section-title">New Product</div>

<div class="grid">
<div class="card"><img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8"></div>
<div class="card"><img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"></div>
<div class="card"><img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30"></div>
<div class="card"><img src="https://images.unsplash.com/photo-1585386959984-a4155224a1ad"></div>
</div>

<div class="section-title">Hot Selling</div>

<div class="grid">
<div class="card"><img src="https://images.unsplash.com/photo-1546868871-7041f2a55e12"></div>
<div class="card"><img src="https://images.unsplash.com/photo-1511385348-a52b4a160dc2"></div>
</div>

<script>
let user = JSON.parse(localStorage.getItem("user"));
document.getElementById("userInfo").innerText = user.email + " | ID: 633551";

function toggleAccount(){
let menu = document.getElementById("accountMenu");
menu.style.display = menu.style.display === "none" ? "block" : "none";
}

function toggleLang(){
let menu = document.getElementById("langMenu");
menu.style.display = menu.style.display === "none" ? "block" : "none";
}

function setLang(lang){
localStorage.setItem("lang", lang);
applyLang();
toggleLang();
}

function applyLang(){
let lang = localStorage.getItem("lang") || "en";

if(lang === "ar"){
document.querySelector(".section-title").innerText = "التصنيفات";
}
if(lang === "en"){
document.querySelector(".section-title").innerText = "Classified";
}
if(lang === "es"){
document.querySelector(".section-title").innerText = "Clasificado";
}
}

function logout(){
localStorage.removeItem("user");
window.location.href="/login-page";
}

function buy(price){
if(user.balance >= price){
user.balance -= price;
localStorage.setItem("user", JSON.stringify(user));
alert("Purchased!");
}else{
alert("Not enough balance");
}
}

applyLang();

// ================= LOAD PRODUCTS =================
fetch("https://fakestoreapi.com/products")
.then(res => res.json())
.then(data => {
    let container = document.getElementById("products");

    data.forEach(product => {
        let div = document.createElement("div");
        div.className = "card";

     div.innerHTML =
    "<img src='" + product.image + "'>" +
    "<p style='padding:5px;font-size:12px;'>" + product.title.substring(0,40) + "...</p>" +
    "<b style='color:#1976d2;padding:5px;'>$" + product.price + "</b>" +
    "<button onclick='openProduct(" + product.id + ")'>View</button>";

        container.appendChild(div);
    });
});

function openProduct(id){
    localStorage.setItem("productId", id);
    window.location.href = "/product";
}

function toggleSearch(){
let menu = document.getElementById("searchMenu");
menu.style.display = menu.style.display === "none" ? "block" : "none";
}

let searchInput = document.getElementById("searchInput");

searchInput.addEventListener("keypress", function(e){
if(e.key === "Enter"){
saveSearch(this.value);
this.value = "";
}
});

function saveSearch(value){
if(!value) return;

let history = JSON.parse(localStorage.getItem("history") || "[]");
history.unshift(value);
localStorage.setItem("history", JSON.stringify(history));

showHistory();
}

function showHistory(){
let history = JSON.parse(localStorage.getItem("history") || "[]");
let list = document.getElementById("historyList");

list.innerHTML = "";

history.forEach(item=>{
let p = document.createElement("p");
p.innerText = item;
list.appendChild(p);
});
}

showHistory();
function toggleMessages(){
let menu = document.getElementById("messagesMenu");
menu.style.display = menu.style.display === "none" ? "block" : "none";
}

function addMessage(text){
let messages = JSON.parse(localStorage.getItem("messages") || "[]");
messages.unshift(text);
localStorage.setItem("messages", JSON.stringify(messages));
showMessages();
}

function showMessages(){
let messages = JSON.parse(localStorage.getItem("messages") || "[]");
let list = document.getElementById("messagesList");

list.innerHTML = "";

messages.forEach(msg=>{
let div = document.createElement("div");
div.style.background = "white";
div.style.padding = "10px";
div.style.marginBottom = "10px";
div.style.borderRadius = "10px";
div.innerText = msg;
list.appendChild(div);
});
}

showMessages();
function openMenuPage(){
document.getElementById("menuPage").style.display = "block";
}

function closeMenuPage(){
document.getElementById("menuPage").style.display = "none";
}

function openWallet(){
    window.location.href = "/wallet";
}

function openOrders(){
    window.location.href = "/orders";
}

function openHistory(){
    window.location.href = "/history";
}

function openFav(){
    window.location.href = "/favorites";
}

function openSupport(){
    window.location.href = "/support";
}

function openMerchant(){
    window.location.href = "/merchant";
}

function openAddress(){
    window.location.href = "/address";
}

function openEmail(){
    window.location.href = "/manage-email";
}

function openPassword(){
    window.location.href = "/account-password";
}

function openTransaction(){
    window.location.href = "/transaction-password";
}

</script>

</body>
</html>`);
});
// ================= PRODUCT PAGE =================
app.get("/product", (req, res) => {
res.send(`<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body{
margin:0;
font-family:Arial;
background:#f5f5f5;
}

/* IMAGE */
.img-box{
text-align:center;
background:white;
padding:20px;
}
.img-box img{
width:200px;
}

/* CONTENT */
.content{
background:white;
margin-top:10px;
padding:15px;
}

/* TITLE */
.title{
font-size:16px;
margin-bottom:10px;
}

/* PRICE */
.price{
color:#1976d2;
font-size:20px;
font-weight:bold;
}

/* BUTTON */
.btn{
position:fixed;
bottom:0;
left:0;
right:0;
background:#28a745;
color:white;
padding:15px;
text-align:center;
font-size:18px;
cursor:pointer;
}
</style>
</head>

<body>

<div class="img-box">
<img id="productImg">
</div>

<div class="content">
<div class="title" id="productTitle"></div>
<div class="price" id="productPrice"></div>
</div>

<div class="btn" onclick="addToCart()">Add to Cart</div>

<script>
let id = localStorage.getItem("productId");

// جلب المنتج من API
fetch("https://fakestoreapi.com/products/" + id)
.then(res=>res.json())
.then(product=>{
document.getElementById("productImg").src = product.image;
document.getElementById("productTitle").innerText = product.title;
document.getElementById("productPrice").innerText = "$" + product.price;
});

// سلة (مبدئي)
function addToCart(){
let cart = JSON.parse(localStorage.getItem("cart") || "[]");
cart.push(id);
localStorage.setItem("cart", JSON.stringify(cart));
alert("Added to cart");
}
</script>

</body>
</html>`);
});
// ================= START SERVER =================
app.listen(3000, () => {
    console.log("Server started on http://localhost:3000");
});

// ================= WALLET PAGE =================
app.get("/wallet", (req, res) => {
res.send(`<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body{
margin:0;
font-family:Arial;
background:#f0f0f0;
}

/* HEADER */
.header{
background:#1976d2;
color:white;
padding:15px;
display:flex;
align-items:center;
gap:10px;
}
.header span{
font-size:20px;
cursor:pointer;
}

/* TABS */
.tabs{
display:flex;
overflow-x:auto;
background:white;
padding:10px 0;
}
.tabs div{
flex:0 0 auto;
padding:10px 20px;
color:#555;
font-size:14px;
cursor:pointer;
}
.tabs .active{
color:#1976d2;
font-weight:bold;
}

/* SCROLL BAR */
.scroll-bar{
height:4px;
background:#ccc;
margin:0 10px;
border-radius:10px;
overflow:hidden;
}
.scroll-indicator{
height:100%;
width:80px;
background:#888;
border-radius:10px;
transition:0.3s;
}

/* CARD */
.card{
margin:15px;
padding:20px;
border-radius:20px;
background:linear-gradient(45deg,#1e88e5,#1565c0);
color:white;
box-shadow:0 10px 30px rgba(0,0,0,0.2);
}

.card h3{
margin:0;
font-size:14px;
display:flex;
align-items:center;
gap:10px;
}

.balance{
font-size:32px;
margin:15px 0;
}

.card{
position:relative;
}

.actions{
position:absolute;
right:20px;
top:50%;
transform:translateY(-50%);
display:flex;
flex-direction:column;
gap:10px;
}

.btn{
background:white;
color:#333;
padding:8px 15px;
border-radius:20px;
font-size:14px;
display:flex;
justify-content:space-between;
align-items:center;
cursor:pointer;
}

/* EMPTY */
.empty{
text-align:center;
margin-top:80px;
color:#aaa;
font-size:50px;
}
</style>
</head>

<body>

<!-- HEADER -->
<div class="header">
<span onclick="goBack()">←</span>
<h3 style="margin:0;">Wallet</h3>
</div>

<!-- TABS -->
<div class="tabs" id="tabs">
<div class="active">View All</div>
<div>Product transaction</div>
<div>Group</div>
<div onclick="goRecharge()">Recharge</div>
<div>Withdrawal</div>
<div>Refund</div>
<div>System business</div>
<div>Delivery deduction</div>
</div>

<div class="scroll-bar">
<div class="scroll-indicator" id="indicator"></div>
</div>

<!-- CARD -->
<div class="card">
<h3>Account balance 👁️</h3>
<div class="balance" id="balance">0.00</div>
<div>Available balance</div>
</div>

<div class="actions">
<div class="btn" onclick="recharge()">Recharge ➤</div>
<div class="btn" onclick="withdraw()">Withdrawal ➤</div>
</div>

<div class="empty">📄</div>

<script>
let user = JSON.parse(localStorage.getItem("user"));

document.getElementById("balance").innerText = user.balance.toFixed(2);

// BACK
function goBack(){
window.location.href="/dashboard";
}

// BUTTONS
function recharge(){
    window.location.href = "/recharge";
}   

function withdraw(){
    window.location.href = "/withdraw";
}

// TAB SCROLL EFFECT
let tabs = document.getElementById("tabs");
let indicator = document.getElementById("indicator");

tabs.addEventListener("scroll", ()=>{
let maxScroll = tabs.scrollWidth - tabs.clientWidth;
let percent = tabs.scrollLeft / maxScroll;
indicator.style.width = (percent * 100 + 20) + "%";
});

function goRecharge(){
    window.location.href = "/recharge";
}

</script>

</body>
</html>`);
});// ================= RECHARGE PAGE =================
app.get("/recharge", (req, res) => {
res.send(`<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body{
margin:0;
font-family:Arial;
background:#f2f2f2;
}

/* HEADER */
.header{
display:flex;
align-items:center;
padding:15px;
font-size:18px;
}
.header span{
font-size:20px;
cursor:pointer;
margin-right:10px;
}

/* CARD */
.card{
background:white;
margin:10px;
padding:15px;
border-radius:20px;
}

/* PAYMENTS */
.payments{
display:flex;
gap:10px;
margin-bottom:15px;
}
.payments div{
flex:1;
background:#f5f5f5;
padding:15px;
border-radius:15px;
text-align:center;
font-weight:bold;
}

/* NETWORK */
.network{
margin-top:10px;
}
.network button{
padding:8px 20px;
border-radius:20px;
border:1px solid #ccc;
background:white;
margin-right:10px;
cursor:pointer;
}
.network .active{
background:#1976d2;
color:white;
border:none;
}

/* ADDRESS */
.address{
margin-top:10px;
font-size:12px;
word-break:break-all;
}

/* QR */
.qr{
text-align:center;
margin:15px 0;
}
.qr img{
width:150px;
}

/* INPUT */
input{
width:100%;
padding:12px;
border-radius:10px;
border:1px solid #ccc;
margin-top:10px;
}

/* UPLOAD */
.upload{
margin-top:15px;
background:#f5f5f5;
height:80px;
display:flex;
justify-content:center;
align-items:center;
border-radius:10px;
cursor:pointer;
}

/* BUTTON */
.confirm{
margin:20px;
}
.confirm button{
width:100%;
padding:15px;
border:none;
border-radius:10px;
background:#999;
color:white;
font-size:16px;
}
</style>
</head>

<body>

<div class="header">
<span onclick="goBack()">←</span>
<b>Recharge</b>
</div>

<div class="card">

<!-- PAYMENTS -->
<div class="payments">
<div>₮</div>
<div>VISA</div>
<div>Master</div>
<div>PayPal</div>
</div>

<!-- NETWORK -->
<div class="network">
<p>Network</p>
<button class="active" onclick="setNet(this,'TRC20')">TRC20</button>
<button onclick="setNet(this,'ERC20')">ERC20</button>
</div>

<!-- ADDRESS -->
<p>USDT Address</p>
<div class="address" id="address">TBC76ppdDG8aiX4ECAhEmn7TASPm2iAWS</div>

<!-- QR -->
<div class="qr">
<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TBC76ppdDG8aiX4ECAhEmn7TASPm2iAWS">
</div>

<!-- AMOUNT -->
<p>Recharge amount</p>
<input id="amount" placeholder="Please fill in recharge amount">

<!-- UPLOAD -->
<p>Upload transaction record</p>
<div class="upload" onclick="uploadImage()">📷</div>

</div>

<div class="confirm">
<button onclick="confirmRecharge()">Confirm</button>
</div>

<script>
let selectedNet = "TRC20";

// BACK
function goBack(){
window.location.href="/wallet";
}

// NETWORK SWITCH
function setNet(btn, net){
selectedNet = net;

document.querySelectorAll(".network button").forEach(b=>b.classList.remove("active"));
btn.classList.add("active");

// مستقبلاً نغير العنوان من السيرفر
if(net === "TRC20"){
document.getElementById("address").innerText = "TBC76ppdDG8aiX4ECAhEmn7TASPm2iAWS";
}else{
document.getElementById("address").innerText = "ERC20-ADDRESS-EXAMPLE";
}
}

// UPLOAD (مبدئي)
function uploadImage(){
alert("Upload system will be added later");
}

// CONFIRM
function confirmRecharge(){
let amount = document.getElementById("amount").value;

if(!amount){
alert("Enter amount");
return;
}

alert("Request submitted (waiting admin approval)");
}
</script>

</body>
</html>`);
});

// ================= WITHDRAW PAGE =================
app.get("/withdraw", (req, res) => {
res.send(`<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body{
margin:0;
font-family:Arial;
background:#f2f2f2;
}

/* HEADER */
.header{
display:flex;
align-items:center;
padding:15px;
font-size:18px;
}
.header span{
font-size:20px;
cursor:pointer;
margin-right:10px;
}

/* CARD */
.card{
background:white;
margin:10px;
padding:15px;
border-radius:20px;
box-shadow:0 5px 20px rgba(0,0,0,0.05);
}

/* PAYMENTS */
.payments{
display:flex;
gap:10px;
margin-bottom:15px;
}
.payments div{
flex:1;
background:#f5f5f5;
padding:15px;
border-radius:15px;
text-align:center;
font-weight:bold;
}

/* NETWORK */
.network{
margin-top:10px;
}
.network button{
padding:8px 15px;
border-radius:20px;
border:1px solid #ccc;
background:white;
margin:5px;
cursor:pointer;
font-size:12px;
}
.network .active{
background:#1976d2;
color:white;
border:none;
}

/* INPUT */
input{
width:100%;
padding:12px;
border-radius:10px;
border:1px solid #ccc;
margin-top:10px;
}

/* ROW */
.row{
display:flex;
justify-content:space-between;
font-size:13px;
margin-top:5px;
color:#666;
}

/* AMOUNT BOX */
.amount-box{
display:flex;
align-items:center;
border:1px solid #ccc;
border-radius:10px;
padding:10px;
margin-top:10px;
}
.amount-box input{
border:none;
outline:none;
flex:1;
}
.amount-box span{
margin-left:10px;
cursor:pointer;
}

/* CONFIRM */
.confirm{
margin:15px;
}
.confirm button{
width:100%;
padding:15px;
border:none;
border-radius:10px;
background:#999;
color:white;
font-size:16px;
}
</style>
</head>

<body>

<div class="header">
<span onclick="goBack()">←</span>
<b>Withdrawal</b>
</div>

<div class="card">

<!-- PAYMENTS -->
<div class="payments">
<div>₮</div>
<div>VISA</div>
<div>Master</div>
<div>PayPal</div>
</div>

<!-- NETWORK -->
<div class="network">
<p>Withdrawal network</p>
<button class="active" onclick="setNet(this)">ERC20</button>
<button onclick="setNet(this)">TRC20</button>
<button onclick="setNet(this)">HECO</button>
<button onclick="setNet(this)">OMNI</button>
<button onclick="setNet(this)">ALGO</button>
</div>

<!-- ADDRESS -->
<p>USDT address</p>
<input id="address" placeholder="Please fill in withdrawal address">

<div class="row">
<span>Fees</span>
<span>0.00 % USDT</span>
</div>

<!-- AMOUNT -->
<p>Withdrawal amount</p>
<div class="row">
<span></span>
<span id="balanceText">Available 0.00 USDT</span>
</div>

<div class="amount-box">
<input id="amount" placeholder="Minimum number1">
<span>USDT</span>
<span onclick="setAll()">ALL</span>
</div>

<div class="row">
<span>Actual amount</span>
<span id="actual" style="color:red;">0 USDT</span>
</div>

</div>

<div class="confirm">
<button onclick="submitWithdraw()">Confirm</button>
</div>

<script>
let user = JSON.parse(localStorage.getItem("user"));
let selectedNet = "ERC20";

document.getElementById("balanceText").innerText = "Available " + user.balance.toFixed(2) + " USDT";

// BACK
function goBack(){
window.location.href="/wallet";
}

// NETWORK
function setNet(btn){
document.querySelectorAll(".network button").forEach(b=>b.classList.remove("active"));
btn.classList.add("active");
selectedNet = btn.innerText;
}

// ALL BUTTON
function setAll(){
document.getElementById("amount").value = user.balance;
updateActual();
}

// UPDATE ACTUAL
document.getElementById("amount").addEventListener("input", updateActual);

function updateActual(){
let amount = parseFloat(document.getElementById("amount").value) || 0;
document.getElementById("actual").innerText = amount.toFixed(2) + " USDT";
}

// SUBMIT
function submitWithdraw(){
let amount = parseFloat(document.getElementById("amount").value);
let address = document.getElementById("address").value;

if(!amount || amount <= 0){
alert("Enter valid amount");
return;
}

if(!address){
alert("Enter wallet address");
return;
}

if(user.balance < amount){
alert("Not enough balance");
return;
}

user.balance -= amount;
localStorage.setItem("user", JSON.stringify(user));

alert("Withdrawal request submitted");
window.location.href="/wallet";
}
</script>

</body>
</html>`);
});

// ================= ORDERS PAGE =================
app.get("/orders", (req, res) => {
res.send(`<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body{
margin:0;
font-family:Arial;
background:#f5f5f5;
}

/* HEADER */
.header{
background:#1976d2;
color:white;
padding:15px;
display:flex;
align-items:center;
gap:10px;
}
.header span{
cursor:pointer;
font-size:20px;
}

/* TABS */
.tabs{
display:flex;
overflow-x:auto;
background:white;
padding:10px 0;
}
.tabs div{
flex:0 0 auto;
padding:10px 20px;
color:#555;
cursor:pointer;
font-size:14px;
}
.tabs .active{
color:#1976d2;
font-weight:bold;
}

/* SCROLL BAR */
.scroll-bar{
height:4px;
background:#ccc;
margin:0 10px;
border-radius:10px;
overflow:hidden;
}
.scroll-indicator{
height:100%;
width:80px;
background:#888;
border-radius:10px;
transition:0.3s;
}

/* EMPTY */
.empty{
text-align:center;
margin-top:80px;
color:#aaa;
}
.empty-icon{
font-size:60px;
}
</style>
</head>

<body>

<!-- HEADER -->
<div class="header">
<span onclick="goBack()">←</span>
<h3 style="margin:0;">My Orders</h3>
</div>

<!-- TABS -->
<div class="tabs" id="tabs">
<div class="active">ALL</div>
<div>Waiting Payment</div>
<div>Waiting Shipping</div>
<div>Shipped</div>
<div>Completed</div>
</div>

<div class="scroll-bar">
<div class="scroll-indicator" id="indicator"></div>
</div>

<!-- EMPTY -->
<div class="empty">
<div class="empty-icon">📄</div>
<p>No Data</p>
</div>

<script>
// BACK
function goBack(){
window.location.href="/dashboard";
}

// SCROLL EFFECT
let tabs = document.getElementById("tabs");
let indicator = document.getElementById("indicator");

tabs.addEventListener("scroll", ()=>{
let maxScroll = tabs.scrollWidth - tabs.clientWidth;
let percent = tabs.scrollLeft / maxScroll;
indicator.style.width = (percent * 100 + 20) + "%";
});
</script>

</body>
</html>`);
});

// ================= SEARCH HISTORY PAGE =================
app.get("/history", (req, res) => {
res.send(`<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body{
margin:0;
font-family:Arial;
background:#f5f5f5;
}

/* HEADER */
.header{
background:white;
padding:15px;
display:flex;
align-items:center;
gap:10px;
font-size:18px;
border-bottom:1px solid #eee;
}
.header span{
font-size:20px;
cursor:pointer;
}

/* EMPTY */
.empty{
text-align:center;
margin-top:100px;
color:#aaa;
}
.empty-icon{
font-size:60px;
}
</style>
</head>

<body>

<!-- HEADER -->
<div class="header">
<span onclick="goBack()">←</span>
<b>Search History</b>
</div>

<!-- EMPTY -->
<div class="empty">
<div class="empty-icon">📄</div>
<p>No Data</p>
</div>

<script>
function goBack(){
window.location.href="/dashboard";
}
</script>

</body>
</html>`);
});

// ================= FAVORITES PAGE =================
app.get("/favorites", (req, res) => {
res.send(`<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body{
margin:0;
font-family:Arial;
background:#f5f5f5;
}

/* HEADER */
.header{
background:white;
padding:15px;
text-align:center;
font-size:20px;
font-weight:bold;
border-bottom:1px solid #ddd;
}

/* TABS */
.tabs{
display:flex;
margin:10px;
gap:10px;
}
.tabs div{
flex:1;
padding:10px;
text-align:center;
border-radius:20px;
background:#ddd;
cursor:pointer;
}
.tabs .active{
background:#1976d2;
color:white;
}

/* EMPTY */
.empty{
text-align:center;
margin-top:30px;
}
.empty p{
color:#666;
font-size:14px;
}

/* BUTTON */
.shop-btn{
margin:20px;
background:black;
color:white;
padding:12px;
text-align:center;
}

/* GRID */
.grid{
display:grid;
grid-template-columns:1fr 1fr;
gap:10px;
padding:10px;
}
.card{
background:white;
border-radius:10px;
overflow:hidden;
position:relative;
}
.card img{
width:100%;
height:140px;
object-fit:cover;
}
.card p{
font-size:12px;
padding:5px;
}
.price{
color:#1976d2;
font-weight:bold;
padding:5px;
}

/* HEART */
.heart{
position:absolute;
right:8px;
bottom:65px;
background:white;
border-radius:50%;
padding:5px;
cursor:pointer;
font-size:14px;
}

/* SEE MORE */
.more{
margin:20px;
padding:10px;
border:1px solid #333;
text-align:center;
}
</style>
</head>

<body>

<div class="header" style="position:relative;">
<a href="/dashboard" style="position:absolute;left:15px;font-size:20px;text-decoration:none;color:black;">←</a>
Saved items
</div>

<div class="tabs">
<div class="active">Product</div>
<div onclick="window.location.href='/store'">Store</div>
</div>

<div class="empty">
<h3>You have no saved items</h3>
<p>Start saving on shopping by selecting the little heart shape.</p>
<p>We'll sync your items across all your devices.</p>
</div>

<div class="shop-btn">Start shopping</div>

<h3 style="padding:10px;">Recommended</h3>

<div class="grid">

<div class="card">
<img src="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04">
<div class="heart" onclick="toggleFav(1)">🤍</div>
<p>Meta Portal Go - Portable Smart Video Calling 10" Touch Screen with Battery</p>
<div class="price">US$129.99</div>
</div>

<div class="card">
<img src="https://images.unsplash.com/photo-1521334884684-d80222895322">
<div class="heart" onclick="toggleFav(2)">🤍</div>
<p>Tutu Dreams Lace Pom poms Tutu Dress for Girls Flower Girl Tulle Dresses</p>
<div class="price">US$24.99</div>
</div>

<div class="card">
<img src="https://images.unsplash.com/photo-1511385348-a52b4a160dc2">
<div class="heart" onclick="toggleFav(3)">🤍</div>
<p>Anne Klein Women's Leather Strap Watch</p>
<div class="price">US$35.00</div>
</div>

<div class="card">
<img src="https://images.unsplash.com/photo-1605100804763-247f67b3557e">
<div class="heart" onclick="toggleFav(4)">🤍</div>
<p>YL Celtic Knot Ring 925 Sterling Silver Twisted Knot Ring</p>
<div class="price">US$49.99</div>
</div>

<div class="card">
<img src="https://images.unsplash.com/photo-1584917865442-de89df76afd3">
<div class="heart" onclick="toggleFav(5)">🤍</div>
<p>RADLEY London Lyme Terrace Women's Leather Shoulder Bag</p>
<div class="price">US$199.99</div>
</div>

<div class="card">
<img src="https://images.unsplash.com/photo-1585386959984-a4155224a1ad">
<div class="heart" onclick="toggleFav(6)">🤍</div>
<p>BOSTANTEN Sling Bag Crossbody Bag Trendy Leather</p>
<div class="price">US$29.99</div>
</div>

<div class="card">
<img src="https://images.unsplash.com/photo-1520975916090-3105956dac38">
<div class="heart" onclick="toggleFav(7)">🤍</div>
<p>WYPFD Lace Evening Dresses Sexy Deep V-neck Mermaid</p>
<div class="price">US$899.00</div>
</div>

<div class="card">
<img src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789">
<div class="heart" onclick="toggleFav(8)">🤍</div>
<p>AcPower 2 Pairs Drone Propellers for DJI Mavic Pro</p>
<div class="price">US$18.99</div>
</div>

</div>

<div class="more">See more</div>

<script>
// تحميل المفضلة
let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

// تحديث القلوب
document.querySelectorAll(".heart").forEach((el, index)=>{
let id = index + 1;
if(favorites.includes(id)){
el.innerHTML = "❤️";
}
});

// عند الضغط
function toggleFav(id){
let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

if(favorites.includes(id)){
favorites = favorites.filter(f=>f!==id);
}else{
favorites.push(id);
}

localStorage.setItem("favorites", JSON.stringify(favorites));
location.reload();
}
</script>

</body>
</html>`);
});

// ================= CUSTOMER SERVICE PAGE =================
app.get("/support", (req, res) => {
res.send(`<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body{
margin:0;
font-family:Arial;
background:#f5f5f5;
}

/* HEADER */
.header{
background:white;
padding:15px;
display:flex;
align-items:center;
justify-content:center;
position:relative;
font-size:20px;
border-bottom:1px solid #ddd;
}
.header a{
position:absolute;
left:15px;
text-decoration:none;
font-size:20px;
color:black;
}

/* SECTION */
.section{
background:white;
margin:10px;
padding:15px;
border-radius:10px;
}

/* TITLE */
.title{
font-weight:bold;
margin-bottom:10px;
}

/* ITEM */
.item{
display:flex;
align-items:center;
gap:10px;
padding:10px 0;
border-bottom:1px solid #eee;
}
.item:last-child{
border:none;
}

/* BUTTON */
.btn{
background:red;
color:white;
padding:12px;
text-align:center;
border-radius:5px;
margin-top:15px;
}

/* FOOTER TEXT */
.small{
font-size:12px;
color:#666;
margin-top:10px;
}
</style>
</head>

<body>

<div class="header">
<a href="/dashboard">←</a>
Customer Service
</div>

<div class="section">
<div class="title">Support Tools</div>

<div class="item">🤖 ChatBot - Automate customer service with AI</div>
<div class="item">📩 HelpDesk - Support customers with tickets</div>
<div class="item">📚 KnowledgeBase - Guide and educate users</div>
<div class="item">🧩 Widgets - Enhance your website</div>
</div>

<div class="section">
<div class="title">Contact Options</div>

<div class="item">💬 Live Chat (24/7)</div>
<div class="item">📧 Email Support</div>
<div class="item">📞 Phone Support</div>
</div>

<div class="section">
<div class="title">Get App</div>

<div class="item">💻 Web Browser</div>
<div class="item">📱 Android</div>
<div class="item">🍎 iOS</div>
<div class="item">🖥️ Windows</div>
</div>

<div class="section">
<div class="title">Start your free live chat trial</div>
<div class="btn">Sign up free</div>

<div class="small">
Customer service helps you engage with users, answer questions, and improve your platform experience.
</div>
</div>

</body>
</html>`);
});

// ================= MERCHANT PAGE =================
app.get("/merchant", (req, res) => {
res.send(`<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body{
margin:0;
font-family:Arial;
background:#f5f5f5;
}

/* HEADER */
.header{
background:white;
padding:15px;
display:flex;
align-items:center;
justify-content:center;
position:relative;
font-size:22px;
border-bottom:1px solid #ddd;
}
.header a{
position:absolute;
left:15px;
font-size:20px;
text-decoration:none;
color:black;
}

/* BOX */
.box{
background:white;
margin:10px;
padding:15px;
border-radius:10px;
}

/* GRID */
.grid{
display:grid;
grid-template-columns:1fr 1fr 1fr;
text-align:center;
gap:10px;
}

.grid p{
margin:5px 0;
font-size:13px;
color:#555;
}

.value{
font-weight:bold;
font-size:16px;
}

/* SECOND GRID */
.grid4{
display:grid;
grid-template-columns:1fr 1fr 1fr 1fr;
text-align:center;
margin-top:10px;
}

/* TOOLS */
.tools{
display:grid;
grid-template-columns:1fr 1fr 1fr 1fr;
gap:10px;
text-align:center;
margin-top:10px;
}
.tool{
font-size:12px;
}

/* POPUP */
.popup{
position:fixed;
bottom:0;
left:0;
width:100%;
background:white;
border-top-left-radius:15px;
border-top-right-radius:15px;
box-shadow:0 -2px 10px rgba(0,0,0,0.2);
}

.popup p{
text-align:center;
padding:15px;
margin:0;
border-bottom:1px solid #eee;
}

.popup .actions{
display:flex;
}
.popup .actions div{
flex:1;
padding:15px;
text-align:center;
cursor:pointer;
}
.apply{
color:#1976d2;
}
</style>
</head>

<body>

<div class="header">
<a href="/dashboard">←</a>
🏪 Merchant
</div>

<!-- STATS -->
<div class="box">
<div class="grid">
<div>
<p>Products for sale</p>
<div class="value">0</div>
</div>

<div>
<p>Number of Visitor</p>
<div class="value">0</div>
</div>

<div>
<p>Number of order</p>
<div class="value">0</div>
</div>

<div>
<p>Turnover</p>
<div class="value">0.00</div>
</div>

<div>
<p>Credential rating</p>
<div class="value">0</div>
</div>
</div>
</div>

<!-- ORDER STATUS -->
<div class="box">
<div class="grid4">
<div>0<br><small>Waiting for payment</small></div>
<div>0<br><small>Waiting for shipping</small></div>
<div>0<br><small>Waiting for delivery</small></div>
<div>0<br><small>Waiting for refund</small></div>
</div>
</div>

<!-- TOOLS -->
<div class="box">
<b>Basic tools</b>

<div class="tools">
<div class="tool">📦 Listings</div>
<div class="tool">🛠 Manage product</div>
<div class="tool">📑 Manage Order</div>
<div class="tool">⚙️ Store setting</div>
<div class="tool">💰 Store fund</div>
<div class="tool">📘 Instructions</div>
</div>
</div>

<!-- POPUP -->
<div class="popup">
<p>Sorry, you are not yet a business user</p>

<div class="actions">
<div onclick="goBack()">Back</div>
<div class="apply" onclick="apply()">Apply for business</div>
</div>
</div>

<script>
function goBack(){
window.location.href="/dashboard";
}

function apply(){
    window.location.href = "/apply";
}
</script>

</body>
</html>`);
});

// ================= APPLY BUSINESS PAGE =================
app.get("/apply", (req, res) => {
res.send(`<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body{
margin:0;
font-family:Arial;
background:#f5f5f5;
}

/* HEADER */
.header{
background:#1976d2;
color:white;
text-align:center;
padding:15px;
font-size:18px;
position:relative;
}
.header a{
position:absolute;
left:15px;
color:white;
text-decoration:none;
font-size:20px;
}

/* STEPS */
.steps{
display:flex;
justify-content:space-around;
align-items:center;
padding:15px;
background:white;
font-size:12px;
}
.step{
text-align:center;
}
.circle{
width:10px;
height:10px;
border-radius:50%;
background:#ccc;
margin:5px auto;
}
.active{
background:#1976d2;
}

/* CARD */
.card{
background:white;
margin:10px;
padding:15px;
border-radius:15px;
}

/* STORE TYPES */
.types{
display:flex;
gap:10px;
margin-top:10px;
}
.type{
flex:1;
background:#eee;
border-radius:15px;
padding:15px;
text-align:center;
cursor:pointer;
}
.type.active{
border:2px solid #1976d2;
background:white;
}

/* CHECK */
.check{
margin-top:15px;
font-size:13px;
}

/* BUTTON */
.next{
position:fixed;
bottom:10px;
left:10px;
right:10px;
}
.next button{
width:100%;
padding:15px;
border:none;
background:#1976d2;
color:white;
border-radius:10px;
font-size:16px;
}
</style>
</head>

<body>

<div class="header">
<a href="/merchant">←</a>
Apply
</div>

<div class="steps">
<div class="step">
<div class="circle active"></div>
Select store
</div>
<div class="step">
<div class="circle"></div>
Personal information
</div>
<div class="step">
<div class="circle"></div>
ID verification
</div>
<div class="step">
<div class="circle"></div>
Store setting
</div>
</div>

<div class="card">
<b>Select Store Type</b>

<div class="types">
<div class="type active" onclick="selectType(this)">
🏪<br>Personal Store
</div>

<div class="type" onclick="selectType(this)">
🛍<br>Enterprise store
</div>

<div class="type" onclick="selectType(this)">
❤️<br>Charity Store
</div>
</div>

<div class="check">
<input type="checkbox" checked> 
Agree Business Solutions Agreement And Privacy Policy
</div>

</div>

<div class="next">
<button onclick="nextStep()">Next</button>
</div>

<script>
function selectType(el){
document.querySelectorAll(".type").forEach(t=>t.classList.remove("active"));
el.classList.add("active");
}

function nextStep(){
    window.location.href = "/apply-step2";
}
</script>

</body>
</html>`);
});

// ================= APPLY STEP 2 =================
app.get("/apply-step2", (req, res) => {
res.send(`<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body{
margin:0;
font-family:Arial;
background:#f5f5f5;
}

/* HEADER */
.header{
background:#1976d2;
color:white;
text-align:center;
padding:15px;
font-size:18px;
position:relative;
}
.header a{
position:absolute;
left:15px;
color:white;
text-decoration:none;
font-size:20px;
}

/* STEPS */
.steps{
display:flex;
justify-content:space-around;
padding:10px;
background:white;
font-size:12px;
}
.step{text-align:center;}
.circle{
width:10px;height:10px;border-radius:50%;background:#ccc;margin:5px auto;
}
.active{background:#1976d2;}

/* CARD */
.card{
background:white;
margin:10px;
padding:15px;
border-radius:15px;
}

/* INPUT */
input{
width:100%;
padding:12px;
margin:8px 0;
border-radius:8px;
border:1px solid #ddd;
}

/* BUTTONS */
.actions{
display:flex;
gap:10px;
padding:10px;
}
.actions button{
flex:1;
padding:15px;
border:none;
border-radius:10px;
font-size:16px;
}
.prev{background:#999;color:white;}
.next{background:#1976d2;color:white;}
</style>
</head>

<body>

<div class="header">
<a href="/apply">←</a>
Next
</div>

<div class="steps">
<div class="step"><div class="circle active"></div>Select store</div>
<div class="step"><div class="circle active"></div>Personal information</div>
<div class="step"><div class="circle"></div>ID verification</div>
<div class="step"><div class="circle"></div>Store setting</div>
</div>

<div class="card">
<b>Fill in personal information</b>

<p>Country of Citizenship</p>
<input placeholder="Please enter nationality">

<p>Personal ID</p>
<input placeholder="Please enter ID">

<p>ID number</p>
<input placeholder="Please enter the ID number">

<p>Certificate validity</p>
<input placeholder="Please enter the validity of the ID">

<p>Document issuing country</p>
<input placeholder="Please enter the country of issue">
</div>

<div class="card">
<p>Name</p>
<input placeholder="Please enter your name">

<p>Place of birth</p>
<input placeholder="Please enter place of birth">

<p>Date of birth</p>
<input placeholder="Please enter date of birth">

<p>Place of residence</p>
<input placeholder="Please enter place of residence">

<p>City/Town</p>
<input placeholder="Please enter City/Town">

<p>Street name</p>
<input placeholder="Please enter street name">

<p>Postal code</p>
<input placeholder="Please enter postal code">

<p>Contact email</p>
<input placeholder="Please enter the correct contact email">

<label>
<input type="checkbox" checked>
I confirm that my address is correct and I know this information cannot be changed until address verification is complete
</label>
</div>

<div class="actions">
<button class="prev" onclick="window.location.href='/apply'">Previous</button>
<button class="next" onclick="nextStep2()">Next</button>
</div>

<script>
function nextStep2(){
    window.location.href = "/apply-step3";
}
</script>

</body>
</html>`);
});
// ================= APPLY STEP 3 (ID VERIFICATION) =================
app.get("/apply-step3", (req, res) => {
res.send(`<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body{
margin:0;
font-family:Arial;
background:#f5f5f5;
}

/* HEADER */
.header{
background:#1976d2;
color:white;
text-align:center;
padding:15px;
font-size:18px;
position:relative;
}
.header a{
position:absolute;
left:15px;
color:white;
text-decoration:none;
font-size:20px;
}

/* STEPS */
.steps{
display:flex;
justify-content:space-around;
padding:10px;
background:white;
font-size:12px;
}
.step{text-align:center;}
.circle{
width:10px;height:10px;border-radius:50%;background:#ccc;margin:5px auto;
}
.active{background:#1976d2;}

/* CARD */
.container{
padding:15px;
}

.upload-box{
background:white;
border-radius:15px;
padding:20px;
display:flex;
justify-content:space-between;
gap:10px;
}

.card{
flex:1;
background:#fafafa;
border-radius:15px;
padding:15px;
text-align:center;
box-shadow:0 2px 10px rgba(0,0,0,0.05);
}

.card img{
width:100%;
border-radius:10px;
margin-bottom:10px;
}

.btn{
background:#1976d2;
color:white;
padding:10px;
border-radius:10px;
margin-top:10px;
cursor:pointer;
font-size:14px;
}

/* BUTTONS */
.actions{
display:flex;
gap:10px;
padding:15px;
}
.actions button{
flex:1;
padding:15px;
border:none;
border-radius:10px;
font-size:16px;
}
.prev{background:#999;color:white;}
.next{background:#1976d2;color:white;}
</style>
</head>

<body>

<div class="header">
<a href="/apply-step2">←</a>
ID Verification
</div>

<div class="steps">
<div class="step"><div class="circle active"></div>Select store</div>
<div class="step"><div class="circle active"></div>Personal info</div>
<div class="step"><div class="circle active"></div>ID verification</div>
<div class="step"><div class="circle"></div>Store setting</div>
</div>

<div class="container">

<h3>Identity document</h3>

<div class="upload-box">

<div class="card">
<img id="frontPreview" src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png">
<input type="file" id="frontInput" accept="image/*" style="display:none;">
<div class="btn" onclick="document.getElementById('frontInput').click()">Upload ID front page</div>
</div>

<div class="card">
<img id="backPreview" src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png">
<input type="file" id="backInput" accept="image/*" style="display:none;">
<div class="btn" onclick="document.getElementById('backInput').click()">Upload ID back page</div>
</div>

</div>

</div>

<div class="actions">
<button class="prev" onclick="window.location.href='/apply-step2'">Previous</button>
<button class="next" onclick="nextStep3()">Next</button>
</div>

<script>
// FRONT
let frontInput = document.getElementById("frontInput");
let frontPreview = document.getElementById("frontPreview");

frontInput.addEventListener("change", function(){
let file = this.files[0];

if(file){
let reader = new FileReader();

reader.onload = function(e){
frontPreview.src = e.target.result;
localStorage.setItem("idFront", e.target.result);
};

reader.readAsDataURL(file);
}
});

// BACK
let backInput = document.getElementById("backInput");
let backPreview = document.getElementById("backPreview");

backInput.addEventListener("change", function(){
let file = this.files[0];

if(file){
let reader = new FileReader();

reader.onload = function(e){
backPreview.src = e.target.result;
localStorage.setItem("idBack", e.target.result);
};

reader.readAsDataURL(file);
}
});

// تحميل الصور إذا موجودة
let savedFront = localStorage.getItem("idFront");
if(savedFront){
frontPreview.src = savedFront;
}

let savedBack = localStorage.getItem("idBack");
if(savedBack){
backPreview.src = savedBack;
}

// NEXT
function nextStep3(){
window.location.href = "/apply-step4";
}
</script>

</body>
</html>`);
});
// ================= APPLY STEP 4 (STORE SETTING) =================
app.get("/apply-step4", (req, res) => {
res.send(`<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body{
margin:0;
font-family:Arial;
background:#f5f5f5;
}

/* HEADER LINE */
.top-line{
height:4px;
background:#1976d2;
}

/* STEPS */
.steps{
display:flex;
justify-content:space-around;
align-items:center;
padding:10px;
background:white;
font-size:12px;
}
.step{text-align:center;}
.circle{
width:10px;
height:10px;
border-radius:50%;
background:#1976d2;
margin:5px auto;
}

/* CONTAINER */
.container{
padding:20px;
}

/* TITLE */
.title{
font-size:16px;
margin-bottom:10px;
display:flex;
align-items:center;
gap:5px;
}

/* LOGO BOX */
.logo-box{
background:white;
border-radius:20px;
padding:20px;
text-align:center;
width:180px;
margin:0 auto;
box-shadow:0 5px 20px rgba(0,0,0,0.05);
}

.logo-box img{
width:80px;
opacity:0.5;
margin-bottom:10px;
}

.upload-btn{
background:#1976d2;
color:white;
padding:10px;
border-radius:10px;
cursor:pointer;
}

/* INPUT CARD */
.card{
background:white;
margin-top:20px;
padding:15px;
border-radius:15px;
}

input{
width:100%;
padding:12px;
border-radius:10px;
border:1px solid #ccc;
margin-top:10px;
}

/* BUTTON */
.confirm{
position:fixed;
bottom:15px;
left:15px;
right:15px;
}

.confirm button{
width:100%;
padding:15px;
border:none;
border-radius:10px;
background:#1976d2;
color:white;
font-size:16px;
}
</style>
</head>

<body>

<div class="top-line"></div>

<!-- STEPS -->
<div class="steps">
<div class="step">Select store<div class="circle"></div></div>
<div class="step">Personal information<div class="circle"></div></div>
<div class="step">ID verification<div class="circle"></div></div>
<div class="step">Store setting<div class="circle"></div></div>
</div>

<div class="container">

<div class="title">📷 Store setting</div>

<!-- LOGO -->
<div class="logo-box">
<img id="logoPreview" src="https://cdn-icons-png.flaticon.com/512/149/149071.png">
<input type="file" id="logoInput" accept="image/*" style="display:none;">
<div class="upload-btn" onclick="document.getElementById('logoInput').click()">Upload Store Logo</div>
</div>

<!-- STORE NAME -->
<div class="card">
<p>Store name</p>
<input id="storeName" placeholder="Please enter" style="margin-bottom:80px;color:black;background:white;">
</div>

</div>

<!-- CONFIRM -->
<div class="confirm">
<button onclick="submitStore()">Confirm submission</button>
</div>

<script>
let logoInput = document.getElementById("logoInput");
let logoPreview = document.getElementById("logoPreview");

// عند اختيار صورة
logoInput.addEventListener("change", function(){
let file = this.files[0];

if(file){
let reader = new FileReader();

reader.onload = function(e){
logoPreview.src = e.target.result;

// نحفظ الصورة
localStorage.setItem("storeLogo", e.target.result);
};

reader.readAsDataURL(file);
}
});

// عند تحميل الصفحة
let savedLogo = localStorage.getItem("storeLogo");
if(savedLogo){
logoPreview.src = savedLogo;
}

function submitStore(){
let name = document.getElementById("storeName").value;

if(!name){
alert("Please enter store name");
return;
}

localStorage.setItem("storeName", name);
window.location.href="/merchant-dashboard";
}
</script>

</body>
</html>`);
});
// ================= MERCHANT DASHBOARD =================
app.get("/merchant-dashboard", (req, res) => {
res.send(`<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body{
margin:0;
font-family:Arial;
background:#f2f2f2;
}

/* HEADER */
.header{
background:#1976d2;
color:white;
text-align:center;
padding:20px;
font-size:20px;
}

/* PROFILE */
.profile{
padding:15px;
}
.profile img{
width:60px;
height:60px;
border-radius:50%;
}

/* CARD */
.card{
background:white;
margin:10px;
padding:15px;
border-radius:10px;
box-shadow:0 2px 10px rgba(0,0,0,0.05);
}

/* GRID */
.grid{
display:grid;
grid-template-columns:1fr 1fr 1fr;
text-align:center;
gap:10px;
}

.grid p{
margin:5px 0;
font-size:13px;
color:#555;
}

.value{
font-weight:bold;
font-size:16px;
}

/* GRID 4 */
.grid4{
display:grid;
grid-template-columns:1fr 1fr 1fr 1fr;
text-align:center;
}

/* BALANCE */
.balance{
display:grid;
grid-template-columns:1fr 1fr;
text-align:center;
gap:10px;
}

/* TOOLS */
.tools{
display:grid;
grid-template-columns:1fr 1fr 1fr 1fr;
gap:15px;
text-align:center;
margin-top:10px;
}
.tool{
font-size:12px;
}
.tool img{
width:40px;
margin-bottom:5px;
}
</style>
</head>

<body>

<div class="header" style="position:relative;">
<span onclick="goBack()" style="position:absolute;left:15px;font-size:20px;cursor:pointer;">←</span>
Confirm submission
</div>

<div class="profile">
<img src="https://cdn-icons-png.flaticon.com/512/149/149071.png">
</div>

<!-- STATS -->
<div class="card">
<div class="grid">
<div>
<p>Products for sale</p>
<div class="value">0</div>
</div>

<div>
<p>Number of Visitor</p>
<div class="value">0</div>
</div>

<div>
<p>Number of order</p>
<div class="value">0</div>
</div>

<div>
<p>Turnover</p>
<div class="value">0.00</div>
</div>

<div>
<p>Credential rating</p>
<div class="value">0</div>
</div>
</div>
</div>

<!-- ORDER STATUS -->
<div class="card">
<div class="grid4">
<div>0<br><small>Waiting for payment</small></div>
<div>0<br><small>Waiting for shipping</small></div>
<div>0<br><small>Waiting for delivery</small></div>
<div>0<br><small>Waiting for refund</small></div>
</div>
</div>

<!-- BALANCE -->
<div class="card">
<div class="balance">
<div>
<p>0.00</p>
<small>Available balance</small>
</div>

<div>
<p>0.00</p>
<small>Total working capital</small>
</div>

<div>
<p>0.00</p>
<small>Profit of the day</small>
</div>

<div>
<p>0.00</p>
<small>Total profit credited</small>
</div>
</div>
</div>

<!-- TOOLS -->
<div class="card">
<b>Basic tools</b>

<div class="tools">
<div class="tool">
<img src="https://cdn-icons-png.flaticon.com/512/891/891462.png">
<p>Listings</p>
</div>

<div class="tool">
<img src="https://cdn-icons-png.flaticon.com/512/2921/2921222.png">
<p>Manage product</p>
</div>

<div class="tool">
<img src="https://cdn-icons-png.flaticon.com/512/3144/3144456.png">
<p>Manage Order</p>
</div>

<div class="tool">
<img src="https://cdn-icons-png.flaticon.com/512/2099/2099058.png">
<p>Store setting</p>
</div>

<div class="tool">
<img src="https://cdn-icons-png.flaticon.com/512/2331/2331949.png">
<p>Store Operating fund</p>
</div>

<div class="tool">
<img src="https://cdn-icons-png.flaticon.com/512/1828/1828817.png">
<p>Instructions for operation</p>
</div>
</div>

</div>

</body>

<script>
function goBack(){
    window.location.href = "/dashboard";
}
</script>
</html>`);
});

// ================= ADDRESS PAGE =================
app.get("/address", (req, res) => {
res.send(`<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body{
margin:0;
font-family:Arial;
background:#f5f5f5;
}

/* HEADER */
.header{
background:white;
padding:15px;
display:flex;
align-items:center;
gap:10px;
font-size:20px;
border-bottom:1px solid #eee;
}
.header span{
font-size:20px;
cursor:pointer;
}

/* EMPTY */
.empty{
text-align:center;
margin-top:100px;
color:#aaa;
}
.empty-icon{
font-size:60px;
}
</style>
</head>

<body>

<div class="header">
<span onclick="goBack()">←</span>
<b>📍 Address</b>
</div>

<div class="empty">
<div class="empty-icon">📄</div>
<p>Not Available</p>
</div>

<script>
function goBack(){
window.location.href="/dashboard";
}
</script>

</body>
</html>`);
});

// ================= MANAGE EMAIL PAGE =================
app.get("/manage-email", (req, res) => {
res.send(`<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body{
margin:0;
font-family:Arial;
background:#f5f5f5;
}

/* HEADER */
.header{
background:white;
padding:15px;
display:flex;
align-items:center;
gap:10px;
font-size:20px;
border-bottom:1px solid #eee;
}
.header span{
cursor:pointer;
font-size:20px;
}

/* CARD */
.card{
background:white;
margin:15px;
padding:20px;
border-radius:15px;
box-shadow:0 5px 20px rgba(0,0,0,0.05);
}

/* INPUT */
input{
width:100%;
padding:12px;
margin-top:10px;
border-radius:10px;
border:1px solid #ddd;
}

/* BUTTON */
button{
width:100%;
padding:15px;
margin-top:20px;
border:none;
border-radius:10px;
background:#1976d2;
color:white;
font-size:16px;
}
</style>
</head>

<body>

<div class="header">
<span onclick="goBack()">←</span>
<b>📧 Manage Email</b>
</div>

<div class="card">
<p id="userEmail"></p>

<p style="color:#999;">Old Email verification code</p>
<input placeholder="Old Email verification code">

<p style="text-align:right;font-size:12px;">Verification Code</p>

<button onclick="nextStep()">Next</button>
</div>

<script>
let user = JSON.parse(localStorage.getItem("user"));

// عرض الإيميل
document.getElementById("userEmail").innerText = user.email;

// رجوع
function goBack(){
window.location.href="/dashboard";
}

// زر Next (مبدئي)
function nextStep(){
alert("Verification step will be added");
}
</script>

</body>
</html>`);
});

// ================= ACCOUNT PASSWORD PAGE =================
app.get("/account-password", (req, res) => {
res.send(`<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body{
margin:0;
font-family:Arial;
background:#f5f5f5;
}

/* HEADER */
.header{
background:white;
padding:15px;
display:flex;
align-items:center;
gap:10px;
font-size:20px;
border-bottom:1px solid #eee;
}
.header span{
cursor:pointer;
font-size:20px;
}

/* CARD */
.card{
background:white;
margin:15px;
padding:20px;
border-radius:15px;
box-shadow:0 5px 20px rgba(0,0,0,0.05);
}

/* INPUT */
input{
width:100%;
padding:12px;
margin-top:10px;
border-radius:10px;
border:1px solid #ddd;
}

/* BUTTON */
button{
width:100%;
padding:15px;
margin-top:20px;
border:none;
border-radius:10px;
background:#1976d2;
color:white;
font-size:16px;
}
</style>
</head>

<body>

<div class="header">
<span onclick="goBack()">←</span>
<b>🔐 Account Password</b>
</div>

<div class="card">
<p id="userEmail"></p>

<input id="newPass" type="password" placeholder="Please enter new password">

<p style="text-align:right;font-size:12px;">Verification Code</p>
<input id="code" placeholder="Please enter Email verification code">

<button onclick="savePassword()">Save</button>
</div>

<script>
let user = JSON.parse(localStorage.getItem("user"));

// عرض الإيميل
document.getElementById("userEmail").innerText = user.email;

// رجوع
function goBack(){
window.location.href="/dashboard";
}

// حفظ الباسورد
function savePassword(){
let newPass = document.getElementById("newPass").value;

if(!newPass){
alert("Enter new password");
return;
}

// تحديث الباسورد
user.password = newPass;
localStorage.setItem("user", JSON.stringify(user));

alert("Password updated successfully");
window.location.href="/dashboard";
}
</script>

</body>
</html>`);
});

// ================= TRANSACTION PASSWORD PAGE =================
app.get("/transaction-password", (req, res) => {
res.send(`<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body{
margin:0;
font-family:Arial;
background:#f5f5f5;
}

.header{
background:white;
padding:15px;
display:flex;
align-items:center;
gap:10px;
font-size:20px;
border-bottom:1px solid #eee;
}
.header span{
cursor:pointer;
font-size:20px;
}

.card{
background:white;
margin:15px;
padding:20px;
border-radius:15px;
box-shadow:0 5px 20px rgba(0,0,0,0.05);
}

input{
width:100%;
padding:12px;
margin-top:10px;
border-radius:10px;
border:1px solid #ddd;
}

button{
width:100%;
padding:15px;
margin-top:20px;
border:none;
border-radius:10px;
background:#1976d2;
color:white;
font-size:16px;
}
</style>
</head>

<body>

<div class="header">
<span onclick="goBack()">←</span>
<b>🔑 Transaction Password</b>
</div>

<div class="card">
<p id="userEmail"></p>

<input id="transPass" type="password" maxlength="6" placeholder="Please enter 6 characters password">

<p style="text-align:right;font-size:12px;">Verification Code</p>
<input placeholder="Please enter Email verification code">

<button onclick="saveTransaction()">Save</button>
</div>

<script>
let user = JSON.parse(localStorage.getItem("user"));

// عرض الإيميل
document.getElementById("userEmail").innerText = user.email;

// رجوع
function goBack(){
window.location.href="/dashboard";
}

// حفظ الباسورد
function saveTransaction(){
let pass = document.getElementById("transPass").value;

if(pass.length !== 6){
alert("Password must be 6 characters");
return;
}

user.transactionPassword = pass;
localStorage.setItem("user", JSON.stringify(user));

alert("Transaction password saved");
window.location.href="/dashboard";
}
</script>

</body>
</html>`);
});