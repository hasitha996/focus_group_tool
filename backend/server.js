const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

const corsOptions = {
  origin: "http://localhost:3000"
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;

db.sequelize.sync({ force: true }).then(() => {
  console.log("Database synchronized with { force: true }");
  initializeRoles();
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the backend application." });
});

// Ensure these paths and imports match the correct locations
const authRoutes = require("./app/routes/auth.routes");
const roomRoutes = require("./app/routes/room.routes");
const liveKitRoutes = require("./app/routes/livekit.routes");

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/livekit", liveKitRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initializeRoles() {
  Role.bulkCreate([
    { id: 1, name: "participant" },
    { id: 2, name: "moderator" },
    { id: 3, name: "observer" },
    { id: 4, name: "admin" }
  ]).then(() => {
    console.log("Roles initialized.");
  }).catch(error => {
    console.error("Error initializing roles:", error);
  });
}
