require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');
const cors = require('cors'); // 👈 Add this line

const app = express();
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

const port = 3000;

app.use(cors()); // 👈 And this line
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/ai-reply', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: "system",
          content: "You are a helpful, friendly assistant for VirtuSync Solutions. Our office hours are 9 AM to 5 PM, Monday to Friday. You provide admin support, calendar help, and answer common questions from clients."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 100,
    });

    const aiReply = response.choices[0].message.content;
    res.json({ reply: aiReply });
  } catch (error) {
    console.error("AI Error:", error); // 🔍 This shows the full error in your terminal
    res.status(500).json({ error: 'Something went wrong' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

