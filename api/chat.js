module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: req.body.system },
          ...req.body.messages
        ],
      }),
    });
    const data = await response.json();
    console.log("Groq response:", JSON.stringify(data));
    const reply = data.choices?.[0]?.message?.content || "...Sprachmodul ausgefallen. Typisch.";
    res.status(200).json({ content: [{ type: "text", text: reply }] });
  } catch (err) {
    console.log("Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};