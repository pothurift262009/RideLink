import React, { useState, useEffect, useRef, useCallback } from 'react';
// FIX: Removed non-exported 'LiveSession' type from the import.
import { GoogleGenAI, LiveServerMessage, Modality, Blob, FunctionDeclaration, Type } from '@google/genai';
import { Ride, User } from '../types';
import { MicrophoneIcon, SparklesIcon } from './icons/Icons';

// --- Audio Helper Functions ---
// Decode from Base64
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Encode to Base64
function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Decode Raw PCM to AudioBuffer
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// --- Component ---
interface VoiceBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  allRides: Ride[];
  allUsers: User[];
  onBookRide: (ride: Ride) => void;
}

type TranscriptItem = {
    sender: 'user' | 'ai';
    text: string;
};

type ConnectionState = 'idle' | 'connecting' | 'connected' | 'error' | 'closed';

const VoiceBookingModal: React.FC<VoiceBookingModalProps> = ({ isOpen, onClose, allRides, allUsers, onBookRide }) => {
    const [connectionState, setConnectionState] = useState<ConnectionState>('idle');
    const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
    const [foundRides, setFoundRides] = useState<Ride[]>([]);

    // FIX: Changed 'LiveSession' to 'any' as it is not an exported type.
    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // AI Function Declarations
    const findRidesFunction: FunctionDeclaration = {
        name: 'findRides',
        parameters: {
            type: Type.OBJECT,
            description: "Finds available carpooling rides based on user's criteria.",
            properties: {
                from: { type: Type.STRING, description: 'The departure city.' },
                to: { type: Type.STRING, description: 'The destination city.' },
                date: { type: Type.STRING, description: 'The date of travel in YYYY-MM-DD format.' },
            },
            required: ['from', 'to', 'date'],
        },
    };

    const bookRideFunction: FunctionDeclaration = {
        name: 'bookRide',
        parameters: {
            type: Type.OBJECT,
            description: "Books a specific ride for the user after they have chosen one.",
            properties: {
                rideId: { type: Type.STRING, description: 'The unique ID of the ride to book (e.g., "ride_1").' },
            },
            required: ['rideId'],
        },
    };

    const handleCloseAndReset = useCallback(() => {
        if (sessionPromiseRef.current) {
            sessionPromiseRef.current.then(session => session.close());
        }
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
        }
        if (scriptProcessorRef.current) {
            scriptProcessorRef.current.disconnect();
        }
        if(mediaStreamSourceRef.current) {
            mediaStreamSourceRef.current.disconnect();
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
           audioContextRef.current.close();
        }
        sessionPromiseRef.current = null;
        audioContextRef.current = null;
        mediaStreamRef.current = null;
        setConnectionState('idle');
        setTranscript([]);
        onClose();
    }, [onClose]);

    const startSession = useCallback(async () => {
        setConnectionState('connecting');
        setTranscript([{ sender: 'ai', text: "Hello! I'm your voice assistant. Where would you like to go today?" }]);
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            let currentInputTranscription = '';
            let currentOutputTranscription = '';

            const sessionPromise = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        setConnectionState('connected');
                        // FIX: Cast window to `any` to allow access to the non-standard `webkitAudioContext` for older browser compatibility, resolving a TypeScript error.
                        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                        const source = audioContextRef.current.createMediaStreamSource(stream);
                        mediaStreamSourceRef.current = source;
                        const scriptProcessor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
                        scriptProcessorRef.current = scriptProcessor;
                        
                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob: Blob = {
                                data: encode(new Uint8Array(new Int16Array(inputData.map(x => x * 32768)).buffer)),
                                mimeType: 'audio/pcm;rate=16000',
                            };
                            sessionPromiseRef.current?.then((session) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(audioContextRef.current.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        // Handle Transcription
                        if (message.serverContent?.inputTranscription) {
                            currentInputTranscription += message.serverContent.inputTranscription.text;
                        }
                        if (message.serverContent?.outputTranscription) {
                           currentOutputTranscription += message.serverContent.outputTranscription.text;
                        }
                        if (message.serverContent?.turnComplete) {
                            setTranscript(prev => [...prev, { sender: 'user', text: currentInputTranscription }, { sender: 'ai', text: currentOutputTranscription }]);
                            currentInputTranscription = '';
                            currentOutputTranscription = '';
                        }
                        
                        // Handle Tool Calls
                        if (message.toolCall) {
                            for (const fc of message.toolCall.functionCalls) {
                                let result = "An unknown error occurred.";
                                if (fc.name === 'findRides') {
                                    // FIX: Cast function call arguments to string before using string methods.
                                    const results = allRides.filter(r => 
                                        r.from.toLowerCase() === (fc.args.from as string).toLowerCase() &&
                                        r.to.toLowerCase() === (fc.args.to as string).toLowerCase()
                                    );
                                    setFoundRides(results);

                                    if(results.length > 0) {
                                      const top3 = results.slice(0, 3);
                                      const rideStrings = top3.map((r, i) => {
                                          const driver = allUsers.find(u => u.id === r.driverId);
                                          return `Option ${i + 1} is with driver ${driver?.name}, leaving at ${r.departureTime} for ${r.pricePerSeat} rupees. To book this, say 'book ride ${r.id}'.`;
                                      }).join('\n');
                                      result = `I found ${results.length} rides. Here are the top ${top3.length}:\n${rideStrings}\nWhich one would you like?`;
                                    } else {
                                      result = "I'm sorry, I couldn't find any rides for that route on that date. Would you like to try another date?";
                                    }

                                } else if (fc.name === 'bookRide') {
                                    const rideToBook = allRides.find(r => r.id === fc.args.rideId);
                                    if(rideToBook) {
                                        onBookRide(rideToBook);
                                        result = `Great! Your ride with ID ${fc.args.rideId} has been booked. You will be redirected shortly.`;
                                        setTimeout(() => handleCloseAndReset(), 4000);
                                    } else {
                                        result = `I couldn't find a ride with the ID ${fc.args.rideId}. Please try again.`;
                                    }
                                }
                                
                                sessionPromiseRef.current?.then(session => {
                                    session.sendToolResponse({ functionResponses: { id: fc.id, name: fc.name, response: { result } } });
                                });
                            }
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Session error:', e);
                        setConnectionState('error');
                    },
                    onclose: (e: CloseEvent) => {
                        setConnectionState('closed');
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    outputAudioTranscription: {},
                    inputAudioTranscription: {},
                    tools: [{ functionDeclarations: [findRidesFunction, bookRideFunction] }],
                    systemInstruction: `You are a voice assistant for RideLink, a carpooling app. Your task is to help the user book a ride.
                    1. First, ask for the departure city ('leaving from').
                    2. Second, ask for the destination city ('going to').
                    3. Third, ask for the travel date.
                    4. Once you have these three pieces of information, call the 'findRides' function with the collected details.
                    5. The system will return a list of available rides. Read out the options to the user clearly, including the driver's name, departure time, price, and the command to book it (e.g., 'book ride ride_1').
                    6. When the user chooses a ride, call the 'bookRide' function with the corresponding ride ID.
                    7. After booking, confirm to the user that the ride is booked and end the conversation. Be friendly and conversational. Today's date is ${new Date().toISOString().split('T')[0]}.`
                },
            });
            sessionPromiseRef.current = sessionPromise;

        } catch (error) {
            console.error('Failed to get user media or start session:', error);
            setConnectionState('error');
        }
    }, [allRides, allUsers, onBookRide, handleCloseAndReset]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [transcript]);


    if (!isOpen) return null;
    
    const isConnecting = connectionState === 'connecting';
    const isConnected = connectionState === 'connected';

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex justify-center items-center p-4" onClick={handleCloseAndReset}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg h-[70vh] flex flex-col transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="flex items-center p-4 border-b border-slate-200 dark:border-slate-700">
          <SparklesIcon className="w-6 h-6 text-indigo-500 mr-3" />
          <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">AI Voice Booking</h2>
           <div className="ml-auto flex items-center gap-2 text-sm">
                <span className={`h-2.5 w-2.5 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></span>
                <span className="text-slate-500 dark:text-slate-400">{connectionState}</span>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-900 space-y-4">
          {transcript.map((item, index) => (
             <div key={index} className={`flex items-start gap-3 ${item.sender === 'user' ? 'justify-end' : ''}`}>
                {item.sender === 'ai' && <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 mt-1"><SparklesIcon className="w-4 h-4 text-white"/></div>}
                <div className={`p-3 rounded-2xl max-w-sm ${item.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-lg' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-lg'}`}>
                    <p className="text-sm">{item.text}</p>
                </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center">
             <button 
                onClick={isConnected ? handleCloseAndReset : startSession}
                disabled={isConnecting}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors duration-300 focus:outline-none focus:ring-4 ${
                    isConnected ? 'bg-red-500 hover:bg-red-600 focus:ring-red-300' 
                                : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-300'
                } ${isConnecting ? 'bg-slate-400 cursor-not-allowed' : ''}`}
             >
                {isConnecting ? (
                     <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <MicrophoneIcon className="w-10 h-10 text-white" />
                )}
             </button>
             <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
                {isConnecting ? 'Connecting...' : isConnected ? 'Tap to end session' : 'Tap to start conversation'}
             </p>
        </div>
      </div>
    </div>
  );
};

export default VoiceBookingModal;
