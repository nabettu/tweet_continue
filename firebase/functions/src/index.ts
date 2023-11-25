import * as functions from "firebase-functions";
// import { logger } from "firebase-functions";
import { Configuration, OpenAIApi } from "openai";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();
const OPEN_AI_API_KEY = process.env.OPEN_AI_API_KEY;
const API_KEY = process.env.API_KEY;
const isDev = process.env.FUNCTIONS_EMULATOR === "true";

const TOKEN_LIMIT_COUNT = 1000;

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cors = require("cors")({ origin: true });
export const generateTweet = functions
  .runWith({ timeoutSeconds: 300, memory: "1GB" })
  .https.onRequest((request, response) => {
    cors(request, response, async () => {
      console.log("generateTweet start");

      const { text, key } = request.body;
      if (key !== API_KEY) {
        response.status(403).json({ error: "no key" });
        return;
      }
      const configuration = new Configuration({
        apiKey: !isDev ? functions.config().openai.apikey : OPEN_AI_API_KEY,
      });
      const openAI = new OpenAIApi(configuration);
      const completion = await openAI.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: text }],
        top_p: 0.6,
        frequency_penalty: 0.5,
        max_tokens: TOKEN_LIMIT_COUNT,
      });
      const resultText = completion.data.choices[0]?.message?.content?.trim();

      response.status(200).json({ data: resultText });
    });
  });
