
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const KLAVIYO_API_KEY = "XqaUyt";
const LIST_ID = "YiZCZt";

// Middleware
app.use(express.json());

// API Routes
app.post('/api/website-enquiry', async (req, res) => {
  const { firstName, lastName, email, agencyName, message } = req.body;

  // Validation
  if (!email || !firstName) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  const endpoint = `https://a.klaviyo.com/api/v2/list/${LIST_ID}/members`;
  
  const payload = {
    profiles: [
      {
        email: email,
        first_name: firstName,
        last_name: lastName || "",
        properties: {
          agency_name: agencyName || "",
          enquiry_message: message || "",
          source: "LightPath website contact form"
        }
      }
    ]
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Klaviyo API Error:", response.status, errorText);
      return res.status(500).json({ success: false, message: "Klaviyo request failed" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Serve Static Assets (React App)
// Assuming build output is in 'dist' or 'build'
app.use(express.static(path.join(__dirname, 'dist')));

// SPA Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
