require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const twilio  = require('twilio');

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'Backend is running ✅' });
});

// POST /api/send-sms
app.post('/api/send-sms', async (req, res) => {
  const { phoneNumber, customMessage } = req.body;

  if (!phoneNumber || !customMessage) {
    return res.status(400).json({ success: false, message: 'Missing data' });
  }

  try {
    const client = require('twilio')(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const message = await client.messages.create({
      from: 'whatsapp:+14155238886', // Twilio sandbox
      to: `whatsapp:${phoneNumber}`, // dynamic number
      body: customMessage,           // message from your website
    });

    console.log("✅ WhatsApp sent:", message.sid);

    res.json({
      success: true,
      message: 'WhatsApp sent successfully'
    });

  } catch (err) {
    console.log("❌ ERROR:", err.message);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});

// require('dotenv').config();
// const express = require('express');
// const cors    = require('cors');
// const twilio  = require('twilio');

// const app  = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());

// app.get('/', (req, res) => {
//   res.json({ status: 'Backend is running ✅' });
// });

// // ✅ YOUR EXISTING SMS API
// app.post('/api/send-sms', async (req, res) => {
//   // your code...
// });

// // ✅ ADD TEST ROUTE HERE (IMPORTANT: BEFORE app.listen)
// app.get('/test-whatsapp', async (req, res) => {
//   try {
//     const client = require('twilio')(
//       process.env.TWILIO_ACCOUNT_SID,
//       process.env.TWILIO_AUTH_TOKEN
//     );

//     const message = await client.messages.create({
//   from: 'whatsapp:+14155238886', // Twilio sandbox number
//   to: 'whatsapp:+919082888285',  // your number
//   body: messageBody,
// });


//     console.log("✅ WhatsApp sent:", message.sid);
//     res.send("WhatsApp Sent ✅");

//   } catch (err) {
//     console.log("❌ ERROR:", err.message);
//     res.send(err.message);
//   }
// });

// // 🚨 THIS MUST BE LAST
// app.listen(PORT, () => {
//   console.log(`🚀 Backend running on http://localhost:${PORT}`);
// });