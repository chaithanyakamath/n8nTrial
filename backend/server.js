const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/submit", async (req, res) => {
  console.log("Received from React:");
  console.log(req.body);

  try {
    const response = await fetch(process.env.N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const result = await response.text();

    console.log("n8n response:", result);

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: result,
      });
    }

    res.json({
      success: true,
      message: "Data sent to n8n successfully",
    });

  } catch (error) {
    console.error("Error sending to n8n:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});