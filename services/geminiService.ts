
import { GoogleGenAI } from "@google/genai";

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // remove the `data:mime/type;base64,` prefix
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });


export const generateDescription = async (title: string, image: File): Promise<string> => {
  // FIX: Per coding guidelines, assume API_KEY is set and do not add a check for it.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const base64Image = await fileToBase64(image);
  
    const imagePart = {
      inlineData: {
        mimeType: image.type,
        data: base64Image,
      },
    };
    
    const textPart = {
      text: `Você é um leiloeiro especialista e redator. Baseado no título do item "${title}" e na imagem fornecida, escreva uma descrição de leilão atraente e detalhada. A descrição deve ser sedutora para potenciais licitantes, destacar características chave e criar uma sensação de valor e raridade. Não mencione preço ou lances. Formate a saída como um único parágrafo de texto em português.`,
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
    });
    
    return response.text;

  } catch (error) {
    console.error("Error generating description with Gemini:", error);
    return "Houve um erro ao gerar a descrição. Por favor, tente novamente ou escreva a sua própria.";
  }
};
