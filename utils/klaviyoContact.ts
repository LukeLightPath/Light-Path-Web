
export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  agencyName: string;
  message: string;
}

export async function submitContactForm(data: ContactFormData): Promise<boolean> {
  // 1. Validate inputs
  if (!data.firstName?.trim() || !data.lastName?.trim() || !data.email?.trim()) {
    throw new Error("First Name, Last Name, and Email are required.");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    throw new Error("Please enter a valid email address.");
  }

  // 2. Prepare Payload
  const payload = {
    data: {
      type: "profile",
      attributes: {
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        properties: {
          agency_name: data.agencyName,
          message: data.message
        },
        subscriptions: {
          email: {
            marketing: {
              list_id: "YiZCZt"
            }
          }
        }
      }
    }
  };

  // 3. API Configuration
  // Note: In a production client-side app, typically you would use the Client API (a.klaviyo.com) to avoid CORS issues,
  // or route this through a real backend server. We are using the specific endpoint requested.
  const KLAVIYO_PUBLIC_KEY = "XqaUyt"; 
  const ENDPOINT = "https://api.klaviyo.com/api/profiles";

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Authorization": `Klaviyo-API-Key ${KLAVIYO_PUBLIC_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Klaviyo Submission Error:", response.status, errorText);
      throw new Error("Failed to send message. Please try again later.");
    }

    return true;
  } catch (error) {
    console.error("Contact form error:", error);
    throw error;
  }
}
