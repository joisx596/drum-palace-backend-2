const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, "db.json");

function readDB() {
  return JSON.parse(fs.readFileSync(dbPath, "utf-8"));
}

function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

app.get("/", (req, res) => res.json({message:"Drum Palace Backend Running"}));

app.get("/products", (req,res)=>{
  const db = readDB();
  res.json(db.products);
});

app.post("/products", (req,res)=>{
  const db = readDB();
  const product = {id: Date.now(), ...req.body};
  db.products.push(product);
  writeDB(db);
  res.json(product);
});

app.post("/order", (req,res)=>{
  const db = readDB();
  const order = {id: Date.now(), ...req.body, status:"Pending", createdAt:new Date().toISOString()};
  db.orders.push(order);
  writeDB(db);
  res.json(order);
});

app.get("/orders", (req,res)=>{
  const db = readDB();
  res.json(db.orders);
});

app.put("/orders/:id", (req,res)=>{
  const db = readDB();
  const id = Number(req.params.id);
  const order = db.orders.find(o=>o.id===id);
  if(!order) return res.status(404).json({error:"Order not found"});
  order.status = req.body.status || order.status;
  writeDB(db);
  res.json(order);
});

app.post("/pay", (req,res)=>{
  const {phone, price, product} = req.body;
  res.json({success:true, message:"Payment request simulated", phone, price, product});
});

app.listen(PORT, ()=>console.log("Server running on port "+PORT));