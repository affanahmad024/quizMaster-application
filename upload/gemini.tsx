import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyDcuswpF8sAUBVTvrUlnpADXF4gHjTTAxA",
});

const _prompt = `Parse the image and extract the question and options, also find the answer if given otherwise return "".
answer should be the actual answer not the no like a,b,c.... or numbers
remove question no or Q.1 things like that, also remove options no or a,b,c ... .
If the image in no way gives the question, respond with an empty json oobj {}.
`;

export const questionPrompt = async (
  image: string,
  mimeType = "image/jpeg",
  prompt = _prompt
) =>
  await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [
      {
        inlineData: {
          data: image,
          mimeType,
        },
      },
      prompt,
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: {
              type: Type.STRING,
            },
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
            },
            answer: {
              type: Type.STRING,
            },
          },
          propertyOrdering: ["question", "options", "answer"],
        },
      },
    },
  });
