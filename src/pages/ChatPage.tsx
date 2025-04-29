import React, { useState, useEffect, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mic, Send, Loader2, Volume2 } from "lucide-react";
import VoiceSupport from "@/components/VoiceSupport";
import { storeOfflineData, getOfflineData } from "@/utils/offlineSupport";

// Mock message data
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Mock scheme data for the chatbot to recommend
interface Scheme {
  id: string;
  name: string;
  provider: string;
  eligibility: string;
  benefits: string;
  application: string;
}

const schemes: Scheme[] = [
  {
    id: "1",
    name: "Pradhan Mantri Matru Vandana Yojana (PMMVY)",
    provider: "Government of India",
    eligibility: "All pregnant and lactating mothers, excluding those who are in regular employment with Central or State governments or PSUs.",
    benefits: "Cash benefit of ₹5,000 in three installments for the first living child.",
    application: "Apply at your local Anganwadi Center or through the PMMVY portal with required documents."
  },
  {
    id: "2",
    name: "Janani Suraksha Yojana (JSY)",
    provider: "National Health Mission, India",
    eligibility: "All pregnant women in rural and urban areas below the poverty line.",
    benefits: "Financial assistance for delivery, ranging from ₹600 to ₹1,400 depending on the area.",
    application: "Register at local health center during pregnancy. Benefits given after institutional delivery."
  },
  {
    id: "3",
    name: "Ayushman Bharat Pradhan Mantri Jan Arogya Yojana",
    provider: "Government of India",
    eligibility: "Economically vulnerable families as per SECC data.",
    benefits: "Health insurance coverage up to ₹5 lakh per family per year for secondary and tertiary care.",
    application: "Check eligibility on the official website or app, then visit an empaneled hospital with ID proof."
  }
];

const ChatPage = () => {
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>("en-US");
  const [showVoice, setShowVoice] = useState<boolean>(false);
  const [offline, setOffline] = useState<boolean>(!navigator.onLine);

  // Initial greeting message
  useEffect(() => {
    const initialMessage: Message = {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your maternal healthcare assistant. How can I help you today? You can ask about government schemes, health advice during pregnancy, or nearby healthcare facilities.",
      timestamp: new Date(),
    };
    
    // Check if we have stored messages in local storage
    const storedMessages = getOfflineData<Message[]>("chatMessages");
    if (storedMessages && storedMessages.length > 0) {
      setMessages(storedMessages);
    } else {
      setMessages([initialMessage]);
    }
    
    // Set up online/offline listeners
    const handleOnlineStatus = () => {
      setOffline(!navigator.onLine);
      if (!navigator.onLine) {
        toast({
          title: "You're offline",
          description: "Chat history will be saved locally until you're back online.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "You're back online",
          description: "Your chat history has been synchronized.",
        });
      }
    };

    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);

    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
    };
  }, [toast]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // Save messages to local storage for offline access
    if (messages.length > 0) {
      storeOfflineData("chatMessages", messages);
    }
  }, [messages]);

  // Mock function to simulate AI responses
  const generateResponse = (query: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Convert query to lowercase for easier string matching
        query = query.toLowerCase();
        
        // Check for scheme related questions
        if (query.includes("scheme") || query.includes("benefit") || query.includes("support") || query.includes("financial") || query.includes("assistance")) {
          const randomScheme = schemes[Math.floor(Math.random() * schemes.length)];
          resolve(`Here's a scheme that might help you:\n\n**${randomScheme.name}**\n\nEligibility: ${randomScheme.eligibility}\n\nBenefits: ${randomScheme.benefits}\n\nHow to apply: ${randomScheme.application}\n\nWould you like more information about this or other schemes?`);
        }
        // Check for health advice
        else if (query.includes("diet") || query.includes("nutrition") || query.includes("eat") || query.includes("food") || query.includes("healthy")) {
          resolve("For a healthy pregnancy, focus on a balanced diet rich in:\n\n• Folate-rich foods like leafy greens\n• Calcium from dairy or fortified alternatives\n• Iron from lean meats or legumes\n• Healthy fats from nuts and seeds\n• Plenty of fruits and vegetables\n\nAvoid raw/undercooked foods, excessive caffeine, and alcohol. Would you like more specific dietary recommendations?");
        }
        // Check for appointment related questions
        else if (query.includes("appointment") || query.includes("book") || query.includes("doctor") || query.includes("checkup") || query.includes("visit")) {
          resolve("Regular prenatal checkups are important for your health and your baby's development. During your first and second trimesters, you should have an appointment every 4 weeks. In your third trimester, appointments become more frequent.\n\nWould you like me to help you find nearby healthcare facilities or explain what happens during these checkups?");
        }
        // Check for symptom related questions
        else if (query.includes("pain") || query.includes("discomfort") || query.includes("feeling") || query.includes("symptom")) {
          resolve("Some discomfort during pregnancy is normal, but certain symptoms require medical attention. Please consult your healthcare provider if you experience:\n\n• Severe abdominal pain\n• Vaginal bleeding\n• Severe headaches or visual disturbances\n• Decreased fetal movement\n• Fever over 38°C (100.4°F)\n\nWould you like me to explain more about common pregnancy symptoms?");
        }
        // Default response
        else {
          resolve("I'm here to support your maternal health journey. You can ask me about:\n\n• Government schemes and benefits\n• Pregnancy health advice and nutrition\n• Finding healthcare facilities\n• What to expect during checkups\n• Common pregnancy symptoms\n\nHow can I assist you today?");
        }
      }, 1500); // Simulate API delay
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === "") return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    
    try {
      let response: string;
      
      if (offline) {
        // If offline, use simpler responses
        response = "I notice you're currently offline. I'll provide basic information, but for more detailed assistance, please connect to the internet when possible.";
        
        if (input.toLowerCase().includes("scheme") || input.toLowerCase().includes("benefit")) {
          response += "\n\nHere are some common maternal healthcare schemes:\n• Pradhan Mantri Matru Vandana Yojana (PMMVY)\n• Janani Suraksha Yojana (JSY)\n• Ayushman Bharat";
        }
      } else {
        // If online, generate full response
        response = await generateResponse(input);
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleVoiceInput = (text: string) => {
    setInput(text);
  };
  
  const clearChat = () => {
    // Keep just the welcome message
    const initialMessage = messages[0];
    setMessages([initialMessage]);
    storeOfflineData("chatMessages", [initialMessage]);
    toast({
      description: "Chat history cleared",
    });
  };

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance();
      speech.text = text;
      speech.lang = language;
      window.speechSynthesis.speak(speech);
    } else {
      toast({
        title: "Text-to-speech not supported",
        description: "Your browser doesn't support text-to-speech functionality.",
        variant: "destructive",
      });
    }
  };

  return (
    <PageLayout>
      <div className="container max-w-4xl px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-maternal-primary">Health Assistant</h1>
            <p className="text-muted-foreground">Ask about health advice, government schemes, or local resources</p>
          </div>
          <div className="flex items-center mt-4 md:mt-0">
            <Select
              value={language}
              onValueChange={setLanguage}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en-US">English</SelectItem>
                <SelectItem value="hi-IN">हिन्दी (Hindi)</SelectItem>
                <SelectItem value="ta-IN">தமிழ் (Tamil)</SelectItem>
                <SelectItem value="te-IN">తెలుగు (Telugu)</SelectItem>
                <SelectItem value="kn-IN">ಕನ್ನಡ (Kannada)</SelectItem>
                <SelectItem value="bn-IN">বাংলা (Bengali)</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="ml-2" onClick={clearChat}>
              Clear Chat
            </Button>
          </div>
        </div>

        {/* Chat Messages */}
        <Card className="mb-4">
          <CardContent className="p-4 h-[500px] overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "assistant" ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === "assistant"
                        ? "bg-maternal-light text-maternal-dark"
                        : "bg-maternal-primary text-white"
                    }`}
                  >
                    <div className="whitespace-pre-line">{message.content}</div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                      {message.role === "assistant" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => speakMessage(message.content)}
                        >
                          <Volume2 className="h-3 w-3" />
                          <span className="sr-only">Read aloud</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg p-4 bg-maternal-light text-maternal-dark">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
        </Card>

        {/* Voice Input */}
        {showVoice && (
          <div className="mb-4">
            <VoiceSupport 
              onSpeechResult={handleVoiceInput}
              language={language}
            />
          </div>
        )}

        {/* Chat Input */}
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setShowVoice(!showVoice)}
            className={showVoice ? "bg-maternal-primary/10" : ""}
          >
            <Mic className="h-5 w-5" />
            <span className="sr-only">Voice input</span>
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1"
            disabled={loading}
          />
          <Button type="submit" disabled={loading || input.trim() === ""}>
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            <span className="sr-only">Send message</span>
          </Button>
        </form>
        
        <div className="mt-4 text-xs text-muted-foreground text-center">
          {offline ? 
            "You are currently offline. Limited functionality available." : 
            "This AI assistant provides general information and should not replace professional medical advice."}
        </div>
      </div>
    </PageLayout>
  );
};

export default ChatPage;
