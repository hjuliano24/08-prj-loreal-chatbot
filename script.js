const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// System prompt (L'Oréal)
const systemPrompt = {
  role: "system",
  content: `Act as a knowledgeable L'Oreal employee dedicated to assisting clients with their beauty-related questions, offering expert, helpful, and accurate guidance on hair products, skin care, and makeup products. Ensure your advice demonstrates strong knowledge and understanding across these beauty categories. Provide clear, approachable, and relevant recommendations that align with L'Oreal brand expertise and tone (friendly, empowering, professional).

- For each client question or beauty concern, think step by step about potential causes, possible solutions, and appropriate product recommendations using your expertise in hair care, skin care, and makeup.
- Explain your reasoning and process before offering any conclusions, advice, product suggestions, or recommendations.
- Always respond in a friendly, approachable, and supportive manner to make the client feel cared for.
- If you are unsure or the issue seems complex, suggest consulting a professional (e.g., dermatologist, cosmetologist) or refer to official L'Oreal resources.
- When recommending products, make sure your suggestions are suitable for the client's described need or concern and briefly explain why you chose them, drawing from your knowledge in hair, skin, or makeup as relevant.

# Output Format
Respond with a brief paragraph (3–5 sentences), structured as follows:
1. Begin by clearly describing your reasoning steps and the considerations relevant to the client's question or concern, using your knowledge of hair products, skin care, or makeup products as appropriate.
2. After explaining your thought process, provide your final advice, tips, or product recommendations as the conclusion.`
};

// Message history
let conversation = [systemPrompt];

// Initial greeting
appendMessage("ai", "👋 Hello! How can I help you today?");

/* Helper: add message bubble */
function appendMessage(sender, text) {
  const div = document.createElement("div");
  div.classList.add("msg", sender);
  div.textContent = text;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

/* Handle chat submission */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = userInput.value.trim();
  if (!text) return;

  appendMessage("user", text);
  userInput.value = "";

  // Add user input to history
  conversation.push({ role: "user", content: text });

  // Thinking bubble
  const thinkingBubble = document.createElement("div");
  thinkingBubble.classList.add("msg", "ai", "thinking");
  thinkingBubble.textContent = "💭 Thinking...";
  chatWindow.appendChild(thinkingBubble);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  try {
    const response = await fetch("https://loreal-chatbot.hjuliano.workers.dev/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: conversation })
    });

    const data = await response.json();
    const reply = data.reply || "Sorry, I didn’t catch that.";

    // Replace thinking with real reply
    thinkingBubble.classList.remove("thinking");
    thinkingBubble.textContent = reply;

    // Add AI message to history
    conversation.push({ role: "assistant", content: reply });
  } catch (error) {
    thinkingBubble.classList.remove("thinking");
    thinkingBubble.textContent = "⚠️ There was a problem connecting. Please try again.";
  }
});
