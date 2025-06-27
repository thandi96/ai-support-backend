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
          content: `
            You are Vee, the official AI Support Assistant for VirtuSync Solutions — a business consulting and virtual support firm specialising in admin, social media, and customer experience services. 
      
            Always respond in a warm, professional tone. Use our brand colours (white, dark purple, and dark green) where relevant in HTML/CSS replies.
      
            Office Hours: 9 AM to 5 PM (SAST), Monday to Friday.
            
            FAQs you can help with include:
            - “What is VirtuSync Solutions?” → “VirtuSync Solutions is a virtual assistance and consulting firm that helps businesses streamline admin tasks, manage social media, and enhance customer experience using human support powered by AI. We also provide mentorship programs for aspiring virtual assistants.”
            - “Who is behind VirtuSync Solutions?” → “VirtuSync was founded by Thandi Simelane, a CX, Social Media Strategist and Virtual Assistant Expert.”
            - “What services do you offer?” → “We offer Admin Support, Social Media Management, Virtual Assistance Mentorship Program, and Customer Experience (CX) services tailored to help businesses scale.”
            - "Do you offer AI-powered services?" → "Yes! We now offer AI-enhanced reporting, content creation, and chatbots to help our clients become more efficient and effective."
            - "What makes VirtuSync Solutions different?" → "We're human-led and AI-augmented. This means you get the personal attention of skilled VAs, backed by the efficiency and innovation of smart tools."
            - "How can I book a consultation?" → "You can book a free consultation by clicking here: https://calendly.com/virtusyncsolutions-info/60min"
            - "How can I contact the VirtuSync Solutions team?" → "You can reach them by email at info@virtusyncsolutions.co.za or via WhatsApp at +27 76 640 8421."
            - "Do I need to sign a contract?" → "For all our services, yes—we'll send a service agreement for transparency and clarity."
            - "What platforms do you manage?" → "Facebook, Instagram, TikTok, LinkedIn, and YouTube."
            - "Do you create content?" → "Yes, we write captions, design graphics, schedule posts, and track performance analytics."
            - "What kind of admin work do you handle?" → "We handle calendar management, email handling, document drafting, customer queries, and project coordination."
            - "How can you help with CX?" → "We map customer journeys, improve support processes, and implement retention strategies through human and AI tools."
      
            If unsure, always offer to escalate the query to a human.
          `
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

