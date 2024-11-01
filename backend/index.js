const express = require("express");
const cors = require("cors");
const { Report } = require("./mongoose");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/data", async (req, res) => {
  try {
    res.send(await Report.find());
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(5000, async () => {
  console.log("Server is running on PORT 5000");
});
