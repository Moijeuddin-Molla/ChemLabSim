import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import type { SimulationResult } from '../types';
import { InfoCard } from './InfoCard';
import { ZapIcon, AlertTriangleIcon, SendIcon, BookOpenIcon, LinkIcon, FlaskConicalIcon, ScaleIcon, WindIcon } from './icons/Icons';
import { getReactionInfo } from '../services/geminiService';
import { CHEMICALS } from '../constants';

interface ReactionResultProps {
  result: SimulationResult;
}

// FIX: Per coding guidelines, the API key must be obtained from process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const formatQuantity = (q: number) => parseFloat(q.toFixed(3));

export const ReactionResult: React.FC<ReactionResultProps> = ({ result }) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [explanation, setExplanation] = useState<string>('');
  const [sources, setSources] = useState<{ uri: string; title: string }[]>([]);
  const [isInfoLoading, setIsInfoLoading] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const { reaction } = result;

  useEffect(() => {
    // Scroll to bottom whenever chat history updates
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  useEffect(() => {
    if (!result) return;

    const systemInstruction = `You are a helpful and knowledgeable chemistry assistant. Your task is to explain chemical reactions to a student. Be clear, concise, and engaging. 
    The user performed a simulation with the following results:
    - Reaction: ${reaction.equation} (${reaction.name})
    - Description: "${reaction.description}"
    - Limiting Reagent: ${CHEMICALS.find(c => c.id === result.limitingReagentId)?.name || 'N/A'}
    - Products Formed (non-gaseous): ${result.products.map(p => `${formatQuantity(p.quantity)} mol of ${CHEMICALS.find(c=>c.id === p.chemicalId)?.name}`).join(', ')}
    - Gases Produced: ${result.gasesProduced.map(p => `${formatQuantity(p.quantity)} mol of ${CHEMICALS.find(c=>c.id === p.chemicalId)?.name}`).join(', ')}
    - Leftover Reactants: ${result.leftovers.length > 0 ? result.leftovers.map(l => `${formatQuantity(l.quantity)} mol of ${CHEMICALS.find(c=>c.id === l.chemicalId)?.name}`).join(', ') : 'None'}
    Use this as your primary context for the conversation.`;
    
    const newChat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: { systemInstruction },
    });
    setChat(newChat);

    const limitingReagentName = CHEMICALS.find(c => c.id === result.limitingReagentId)?.name || 'N/A';
    const initialMessage = `You've successfully simulated the ${reaction.name || 'reaction'}: ${reaction.equation}! The limiting reagent was ${limitingReagentName}. What would you like to know about this process?`;
    
    setChatHistory([{ role: 'model', text: initialMessage }]);
    setUserInput('');
    setIsLoading(false);

    // Fetch explanation and sources
    const fetchInfo = async () => {
        setIsInfoLoading(true);
        const info = await getReactionInfo(reaction.equation, reaction.description);
        setExplanation(info.explanation);
        setSources(info.sources);
        setIsInfoLoading(false);
    };

    fetchInfo();

  }, [result]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading || !chat) return;

    const currentMessage = userInput;
    setChatHistory(prev => [...prev, { role: 'user', text: currentMessage }]);
    setUserInput('');
    setIsLoading(true);

    try {
      const stream = await chat.sendMessageStream({ message: currentMessage });
      setChatHistory(prev => [...prev, { role: 'model', text: '' }]);
      for await (const chunk of stream) {
        setChatHistory(prev => {
            if (prev.length === 0 || prev[prev.length - 1].role !== 'model') {
                return prev;
            }
            const newHistory = prev.slice(0, -1);
            const updatedLastMessage = {
                ...prev[prev.length - 1],
                text: prev[prev.length - 1].text + chunk.text,
            };
            return [...newHistory, updatedLastMessage];
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setChatHistory(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please check your API key and network connection." }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getChemicalName = (id: string) => CHEMICALS.find(c => c.id === id)?.name || 'Unknown';

  return (
    <InfoCard title={reaction.name || "Reaction Occurred!"} icon={<ZapIcon className="w-6 h-6 text-accent-yellow"/>}>
      <p className="font-mono text-lg text-accent-green bg-black/30 p-3 rounded-md text-center">{reaction.equation}</p>
      
      {reaction.warning && (
          <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-center">
            <AlertTriangleIcon className="w-5 h-5 text-accent-yellow mr-3 flex-shrink-0" />
            <p className="text-sm text-accent-yellow">{reaction.warning}</p>
          </div>
      )}

      {/* Stoichiometry Results */}
       <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
           <div className="bg-lab-bg p-3 rounded-lg">
               <h4 className="text-sm font-bold text-lab-text-secondary flex items-center justify-center"><ScaleIcon className="w-4 h-4 mr-2"/>Limiting Reagent</h4>
               <p className="text-lg font-semibold text-accent-blue">{getChemicalName(result.limitingReagentId!)}</p>
           </div>
            <div className="bg-lab-bg p-3 rounded-lg">
               <h4 className="text-sm font-bold text-lab-text-secondary flex items-center justify-center"><FlaskConicalIcon className="w-4 h-4 mr-2"/>Products</h4>
                <p className="text-md font-semibold text-lab-text">
                    {result.products.length > 0 ? result.products.map(p => `${getChemicalName(p.chemicalId)}: ${formatQuantity(p.quantity)} mol`).join(' | ') : 'None'}
                </p>
           </div>
            {result.gasesProduced.length > 0 && (
                 <div className="bg-lab-bg p-3 rounded-lg md:col-span-2">
                   <h4 className="text-sm font-bold text-lab-text-secondary flex items-center justify-center"><WindIcon className="w-4 h-4 mr-2"/>Gases Produced</h4>
                    <p className="text-md font-semibold text-accent-blue">
                        {result.gasesProduced.map(p => `${getChemicalName(p.chemicalId)}: ${formatQuantity(p.quantity)} mol`).join(' | ')}
                    </p>
               </div>
            )}
            {result.leftovers.length > 0 && (
                 <div className="bg-lab-bg p-3 rounded-lg md:col-span-2">
                   <h4 className="text-sm font-bold text-lab-text-secondary">Leftover Reactants</h4>
                    <p className="text-md font-semibold text-lab-text-secondary">
                        {result.leftovers.map(p => `${getChemicalName(p.chemicalId)}: ${formatQuantity(p.quantity)} mol`).join(' | ')}
                    </p>
               </div>
            )}
       </div>

      {/* Explanation Section */}
      <div className="mt-4 border-t border-lab-border pt-4">
        <h3 className="font-semibold text-lab-text mb-2 flex items-center"><BookOpenIcon className="w-5 h-5 mr-2 text-accent-blue" /> Explanation</h3>
        {isInfoLoading ? (
            <p className="text-sm text-lab-text-secondary italic">Loading explanation...</p>
        ) : (
            <>
                <p className="text-sm text-lab-text-secondary">{explanation}</p>
                {sources.length > 0 && (
                    <div className="mt-3">
                        <h4 className="text-xs font-bold uppercase text-lab-text-secondary mb-1">Sources:</h4>
                        <ul className="flex flex-col space-y-1">
                            {sources.map((source, index) => (
                                <li key={index}>
                                    <a href={source.uri} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-accent-blue hover:underline">
                                        <LinkIcon className="w-4 h-4 mr-2"/>
                                        {source.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </>
        )}
      </div>

      {/* Chat Interface */}
      <div className="mt-4 border-t border-lab-border pt-4">
        <div ref={chatContainerRef} className="max-h-80 h-80 overflow-y-auto pr-2 flex flex-col space-y-4">
            {chatHistory.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-accent-blue text-white' : 'bg-lab-border text-lab-text'}`}>
                        <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    </div>
                </div>
            ))}
             {isLoading && chatHistory[chatHistory.length - 1]?.role === 'user' && (
                <div className="flex justify-start">
                    <div className="max-w-md p-3 rounded-lg bg-lab-border text-lab-text">
                        <div className="flex items-center space-x-2 text-lab-text-secondary">
                            <div className="w-2 h-2 bg-accent-blue rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
                            <div className="w-2 h-2 bg-accent-blue rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 bg-accent-blue rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
        <form onSubmit={handleSendMessage} className="mt-4 flex items-center space-x-2">
            <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ask a follow-up question..."
                disabled={isLoading}
                className="flex-grow bg-lab-bg border border-lab-border rounded-lg px-4 py-2 text-lab-text focus:outline-none focus:ring-2 focus:ring-accent-blue disabled:cursor-not-allowed"
            />
            <button type="submit" disabled={isLoading || !userInput.trim()} className="p-2 rounded-md bg-accent-blue hover:bg-accent-blue/80 text-white transition-colors duration-200 disabled:bg-lab-border disabled:cursor-not-allowed">
                <SendIcon className="w-5 h-5" />
            </button>
        </form>
      </div>
    </InfoCard>
  );
};
