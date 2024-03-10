const express = require("express");
const { OpenAI } = require("openai");
require("dotenv").config();

// OpenAI API key created
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
//önceki mesajları verirken önceki mesajları da her isteğinde göndermelisin.
//role:user ve cevabı- role : asssistant ve cevabı
exports.chatWithGPT3 = async (req, res) => {
  const { prompt, previousMessages } = req.body;
  try {
    const gptResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant. Your answers will help me learn. Your answers have to inside of max 150 tokens. ",
        },
        ...previousMessages,
        {
          role: "user",
          content: `${prompt}`,
        },
      ],
      max_tokens: 150,
      temperature: 0,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: ["\n"],
    });
    res.status(200).json({
      success: true,
      data: gptResponse.choices[0].message.content.trim(),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
