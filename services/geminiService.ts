import { GoogleGenAI } from "@google/genai";
import type { GroundingMetadata, Chemical } from '../types';

// FIX: Per coding guidelines, initialize with API key from process.env.API_KEY.
// The key is assumed to be pre-configured and valid.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export async function getReactionInfo(equation: string, description: string): Promise<{ explanation: string; sources: { uri: string; title: string }[] }> {
    try {
        const prompt = `Provide a brief, one-paragraph explanation for the chemical reaction: ${equation}. This reaction is described as: "${description}". Also find a primary source link for this reaction, like a PubChem or Wikipedia page.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const explanation = response.text;
        
        const groundingMetadata = response.candidates?.[0]?.groundingMetadata as GroundingMetadata | undefined;
        
        const sources = groundingMetadata?.groundingChunks
            ?.map(chunk => chunk.web)
            .filter((web): web is { uri: string; title: string } => !!web) ?? [];

        return { explanation, sources };
    } catch (error) {
        console.error("Error fetching reaction info:", error);
        return {
            explanation: "Could not load additional information. The AI model may be unavailable or there might be a network issue.",
            sources: [],
        };
    }
}

const systemInstruction = `You are an expert chemistry educator creating content for high school and early university students.

When a user clicks on a chemical element in an interactive virtual lab, you will receive a JSON object containing detailed scientific data about that element (including atomic properties, physical characteristics, reactivity, safety, and historical context).

Your task: Transform this raw data into a clear, engaging, and educational paragraph-style description that helps students understand—not just memorize—the element.

Guidelines:

Use plain, accessible English (avoid jargon unless explained).
Group information logically: Identity → Physical Traits → Chemical Behavior → Real-World Relevance → Safety.
Explain why certain properties matter (e.g., “Oxygen’s high electronegativity means it strongly attracts electrons, which is why it forms oxides with almost all other elements”).
Highlight safety clearly and responsibly.
Keep tone friendly, curious, and inspiring—like a passionate teacher.
Do NOT output JSON, code, or bullet points. Use well-structured paragraphs.
If a value is null or missing, skip it gracefully.`;


export async function getElementDescription(chemical: Chemical): Promise<string> {
    const elementData = {
        atomicNumber: chemical.atomicNumber,
        symbol: chemical.formula,
        name: chemical.name,
        atomicMass: chemical.molarMass,
        category: chemical.category,
        group: chemical.group,
        period: chemical.period,
        block: chemical.block,
        electronConfiguration: chemical.electronConfiguration,
        valenceElectrons: chemical.valenceElectrons,
        electronegativityPauling: chemical.electronegativityPauling,
        atomicRadius: chemical.atomicRadius,
        ionizationEnergy: chemical.ionizationEnergy,
        electronAffinity: chemical.electronAffinity,
        phaseAtSTP: chemical.state,
        meltingPointC: chemical.meltingPoint,
        boilingPointC: chemical.boilingPoint,
        densityGPerCm3: chemical.densityGPerCm3,
        crystalStructure: chemical.crystalStructure,
        commonOxidationStates: chemical.commonOxidationStates,
        reactivity: chemical.reactivity,
        conductivity: chemical.conductivity,
        safety: chemical.safety,
        uses: chemical.uses,
        discovery: chemical.discovery,
      };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: JSON.stringify(elementData, null, 2),
            config: {
                systemInstruction,
            },
        });
        
        return response.text;
    } catch (error) {
        console.error("Error fetching element description:", error);
        return "Could not load additional information. The AI model may be unavailable or there might be a network issue. Please check your API key and connection.";
    }
}

export async function getCompoundSummary(compoundName: string): Promise<string> {
    try {
        // Step 1: Fetch structured data using Gemini with Google Search.
        const dataPrompt = `Find structured scientific data for the chemical compound "${compoundName}". Provide the following information in a single, minified JSON object with no markdown formatting: name, molecularFormula, molecularWeight (g/mol, as a number), iupacName, phase (at STP), meltingPoint (°C, as a number), boilingPoint (°C, as a number), solubility (in water), use (as an array of strings), and hazard (as a string). If a value is not available, use null.`;

        const dataResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: dataPrompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        let compoundDataJson = dataResponse.text.trim();
        if (compoundDataJson.startsWith('```json')) {
            compoundDataJson = compoundDataJson.slice(7, -3).trim();
        }
        const compoundData = JSON.parse(compoundDataJson);

        // Step 2: Generate the educational summary using the fetched data.
        const summarySystemInstruction = `You are an expert chemistry educator creating content for high school and early university students.
Your task: Transform raw scientific data about a chemical compound into a clear, concise, and inspiring educational summary that helps students understand the compound—not just see facts.
Output must include these 5 sections in smooth paragraph form (no bullets, no markdown):
1.  Identity & Basics: Name, chemical formula, and what kind of substance it is (e.g., organic acid, ionic salt, gas).
2.  Physical Properties: State at room temperature, color, melting/boiling points, molar mass—and why these matter (e.g., “Its low boiling point means it evaporates easily”).
3.  Chemical Behavior: How it reacts, stability, acidity/basicity, and key chemical roles (e.g., “It donates protons, making it a weak acid”).
4.  Real-World Importance: Where it’s found or used—in nature, industry, medicine, or daily life.
5.  Safety & Handling: Clear, responsible guidance (e.g., “Irritating to eyes—use goggles” or “Non-toxic and safe in food”).
Guidelines:
- Write in friendly, conversational English—like a passionate chemistry teacher.
- Explain the “why” behind properties (e.g., “Its polarity allows it to dissolve salts, which is why it’s a universal solvent”).
- Never invent data—only use what’s provided. If a field is missing, skip it gracefully.
- Keep it to 150–250 words—concise but rich.
- Do NOT use technical jargon without explanation.
- Do NOT output JSON, code, or section headers—just flowing, engaging prose.`;

        const summaryResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: JSON.stringify(compoundData, null, 2),
            config: {
                systemInstruction: summarySystemInstruction,
            },
        });

        return summaryResponse.text;

    } catch (error) {
        console.error(`Error fetching compound summary for "${compoundName}":`, error);
        return `An error occurred while trying to find information for "${compoundName}". The compound may not be in the database, or there could be a network issue. Please try another compound.`;
    }
}

export async function getNuclearExplanation(topic: string): Promise<string> {
    try {
        // Step 1: Fetch structured data using Gemini with Google Search.
        const dataPrompt = `Find structured scientific data for the radioactive isotope or nuclear concept "${topic}". From authoritative sources like IAEA or NNDC, provide the following information in a single, minified JSON object with no markdown formatting: isotope, symbol, halfLifeYears, decayMode, emission, naturalOccurrence, uses (as an array of strings), and hazard (as a string). If it's a concept (like 'alpha decay'), provide a 'concept' name and a 'description'. If a value is not available, use null.`;

        const dataResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: dataPrompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        let nuclearDataJson = dataResponse.text.trim();
        if (nuclearDataJson.startsWith('```json')) {
            nuclearDataJson = nuclearDataJson.slice(7, -3).trim();
        }
        const nuclearData = JSON.parse(nuclearDataJson);

        // Step 2: Generate the educational summary using the fetched data.
        const summarySystemInstruction = `You are an expert chemistry professor creating content for high school and undergraduate students for a virtual nuclear chemistry lab.
Your task: Transform raw scientific data about a radioactive isotope or nuclear concept into a clear, concise, and inspiring educational explanation that helps students understand nuclear chemistry conceptually—not just memorize facts.
Your response must include these 5 elements in smooth, flowing prose (no bullets, no markdown):
1. What it is: Clearly identify the isotope or process.
2. How it behaves: Describe its decay mode, half-life, and emitted radiation—and what that means physically.
3. Why it’s stable or unstable: Explain using the neutron-to-proton ratio or position relative to the belt of stability.
4. Real-world relevance: Where it’s found or used—in nature, medicine, archaeology, or energy.
5. Safety & context: Provide a brief, responsible note on handling or risk.

Critical guidelines:
- Write in friendly, conversational English.
- Never mention weapons, critical mass, reactor design, or neutron multiplication beyond basic fission concepts.
- Do not simulate or describe chain reactions in detail—only state: “Fission releases energy and neutrons, which can sustain a controlled reaction in power plants.”
- Always emphasize: This is a simplified educational model. Real nuclear processes require licensed facilities.
- Keep to 150–250 words.
- If data is missing, skip gracefully—never invent.
- Do NOT output JSON, code, or section headers—just flowing, engaging prose.`;

        const summaryResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: JSON.stringify(nuclearData, null, 2),
            config: {
                systemInstruction: summarySystemInstruction,
            },
        });

        return summaryResponse.text;

    } catch (error) {
        console.error(`Error fetching nuclear explanation for "${topic}":`, error);
        return `An error occurred while trying to find information for "${topic}". The topic may not be in the database, or there could be a network issue. Please try another term.`;
    }
}