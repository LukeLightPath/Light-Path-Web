import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json() as any);

// CORS and Preflight Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// NOTE: Klaviyo contact API; responds with JSON only. UI and copy unchanged.
app.post('/api/klaviyo-contact', async (req, res) => {
  try {
    const { firstName, lastName, email, agencyName, message } = req.body;

    // Validation
    if (!email || !firstName || !lastName) {
      return res.status(400).json({ success: false, error: "First Name, Last Name, and Email are required." });
    }

    // Read credentials from environment
    const apiKey = process.env.KLAVIYO_PRIVATE_API_KEY;
    const listId = process.env.KLAVIYO_LIST_ID;

    if (!apiKey || !listId) {
      console.warn("Server Warning: Missing KLAVIYO_PRIVATE_API_KEY or KLAVIYO_LIST_ID");
      return res.status(500).json({ success: false, error: "Server configuration error." });
    }

    // 1. Create or Update Profile in Klaviyo
    const profilePayload = {
      data: {
        type: 'profile',
        attributes: {
          email,
          first_name: firstName,
          last_name: lastName,
          organization: agencyName,
          properties: {
            contact_message: message,
            source: 'Website Contact Form'
          }
        }
      }
    };

    const profileResponse = await fetch('https://a.klaviyo.com/api/profiles', {
      method: 'POST',
      headers: {
        'Authorization': `Klaviyo-API-Key ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Revision': '2023-10-15'
      },
      body: JSON.stringify(profilePayload)
    });

    if (!profileResponse.ok) {
      const errorText = await profileResponse.text();
      console.error("Klaviyo Profile Error:", profileResponse.status, errorText);
      return res.status(400).json({ success: false, error: "Failed to save contact details." });
    }

    const profileData = await profileResponse.json();
    const profileId = profileData.data?.id;

    // 2. Add Profile to List (if we have an ID)
    if (profileId) {
      const listPayload = {
        data: [{ type: 'profile', id: profileId }]
      };

      const listResponse = await fetch(`https://a.klaviyo.com/api/lists/${listId}/relationships/profiles`, {
        method: 'POST',
        headers: {
          'Authorization': `Klaviyo-API-Key ${apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Revision': '2023-10-15'
        },
        body: JSON.stringify(listPayload)
      });

      if (!listResponse.ok) {
        const listError = await listResponse.text();
        console.error("Klaviyo List Error:", listResponse.status, listError);
      }
    }

    // Success
    return res.status(200).json({ success: true });

  } catch (error: any) {
    console.error("Internal Server Error (Klaviyo Handler):", error);
    return res.status(500).json({ success: false, error: "Internal server error." });
  }
});

// JSON 404 Fallback for API routes to prevent HTML leaking into JSON consumers
app.all('/api/*', (req, res) => {
  res.status(404).json({ success: false, error: "API endpoint not found." });
});

// Serve Static Assets
app.use(express.static(path.join(__dirname, 'dist')) as any);

// SPA Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});