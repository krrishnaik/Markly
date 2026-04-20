export const sendWhatsApp = async (
  phoneNumber: string,
  message: string
) => {
  try {
    const res = await fetch("http://localhost:5000/api/send-whatsapp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phoneNumber,
        message,
      }),
    });

    const data = await res.json();
    console.log("WhatsApp sent:", data);
  } catch (err) {
    console.error("WhatsApp error:", err);
  }
};