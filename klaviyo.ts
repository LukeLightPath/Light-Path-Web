
const KLAVIYO_PUBLIC_KEY = "XqaUyt";

export const sendUserToKlaviyo = async (
  email: string,
  firstName?: string
): Promise<void> => {
  try {
    if (!email) return;

    const payload = {
      data: {
        type: "profile",
        attributes: {
          email,
          ...(firstName ? { first_name: firstName } : {}),
          properties: {
            lead_source: "LightPath Tools Bundle",
            created_via: "firebase_auth_signup"
          }
        }
      }
    };

    const response = await fetch(
      `https://a.klaviyo.com/client/profiles/?company_id=${KLAVIYO_PUBLIC_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "revision": "2023-07-15"
        },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("Klaviyo profile error", response.status, text);
    } else {
      console.log("Klaviyo profile created or updated");
    }
  } catch (err) {
    console.error("Klaviyo profile request failed", err);
  }
};
