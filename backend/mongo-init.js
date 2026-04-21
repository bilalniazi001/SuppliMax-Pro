db = db.getSiblingDB('supplimax');

db.users.insertOne({
  username: "admin",
  email: "bilalniazi781@supplimax.com",
  password: "supplimax67890", // Hash yahan paste karen
  role: "admin",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});