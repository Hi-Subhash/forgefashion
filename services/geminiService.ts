import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateFashionImage = async (prompt: string): Promise<string> => {
  try {
    const enhancedPrompt = `An ultra-high-resolution, 4K, photorealistic e-commerce product photograph of ${prompt}. The item is presented on a clean, minimalist, light gray background. Centered, front view, with sharp focus and studio lighting to highlight fabric texture and detail.`;
    
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: enhancedPrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '9:16',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      return response.generatedImages[0].image.imageBytes;
    } else {
      throw new Error("No image was generated.");
    }
  } catch (error) {
    console.error("Error generating fashion image:", error);
    throw new Error("Failed to generate image. Please try again with a different description.");
  }
};

export const generateFashionDetails = async (prompt: string): Promise<string> => {
  try {
    const detailsPrompt = `You are a fashion expert. Based on the clothing description "${prompt}", provide a compelling and concise product description for an e-commerce website. Include a title, a short paragraph describing the item, suggest suitable high-quality fabrics, and give one creative styling tip. Format the output as clean HTML using Tailwind CSS classes for styling on a dark, transparent background. Use <h2> for the title, <p> for the description and styling tip, and a <ul> with <li> for fabric suggestions. Use classes like 'text-white text-xl font-bold mb-2' for the title and 'text-gray-200 mb-4' for paragraphs. List items should also have a light text color.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: detailsPrompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error generating fashion details:", error);
    throw new Error("Failed to generate product details.");
  }
};

export interface InspirationResult {
  prompt: string;
  texture?: string;
  sheen?: string;
  weight?: string;
}

export const generateInspirationPrompt = async (): Promise<InspirationResult> => {
  try {
    const textures = ['Smooth', 'Rough', 'Woven', 'Knit', 'Fur', 'Quilted', 'Ribbed'].join(', ');
    const sheens = ['Matte', 'Satin', 'Glossy', 'Metallic', 'Iridescent'].join(', ');
    const weights = ['Lightweight', 'Medium-weight', 'Heavyweight', 'Sheer'].join(', ');

    const inspirationPrompt = `Generate a single, short, creative, and inspiring fashion design concept. The concept should be imaginative and concise, suitable for an AI image generator. You MUST provide a main 'prompt' description. You SHOULD OCCASIONALLY, but not always, suggest one or more unique material properties to go with the prompt. When you suggest a property, you MUST choose a value from the provided lists. Do not invent new values. The goal is to inspire creativity with interesting combinations. - Available textures: ${textures} - Available sheens: ${sheens} - Available weights: ${weights} Return a JSON object with your response. Do not include properties if you are not suggesting a value for them. Example 1 (with material properties): {"prompt": "a flowing gown made of liquid starlight", "sheen": "Iridescent", "weight": "Sheer"} Example 2 (with just a prompt): {"prompt": "a tailored blazer made from enchanted moss that subtly glows"} Example 3 (with one property): {"prompt": "a rugged explorer's vest with chunky knit panels", "texture": "Knit"}`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: inspirationPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    prompt: { type: Type.STRING, description: 'The main creative description for the design.' },
                    texture: { type: Type.STRING, description: `An optional texture from the list: ${textures}` },
                    sheen: { type: Type.STRING, description: `An optional sheen from the list: ${sheens}` },
                    weight: { type: Type.STRING, description: `An optional weight from the list: ${weights}` },
                },
                required: ['prompt'],
            },
        },
    });

    const result = JSON.parse(response.text.trim());

    // Sanitize the output to match state values (lowercase)
    const sanitizedResult: InspirationResult = {
      prompt: result.prompt
    };
    if (result.texture) sanitizedResult.texture = result.texture.toLowerCase();
    if (result.sheen) sanitizedResult.sheen = result.sheen.toLowerCase();
    if (result.weight) sanitizedResult.weight = result.weight.toLowerCase();

    return sanitizedResult;

  } catch (error) {
    console.error("Error generating inspiration prompt:", error);
    if (error instanceof SyntaxError) {
        console.warn("JSON parsing failed, falling back to simple prompt.");
        return { prompt: 'a classic trench coat with a futuristic twist' };
    }
    throw new Error("Failed to generate inspiration. Please try again.");
  }
};