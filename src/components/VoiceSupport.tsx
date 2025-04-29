
import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Speaker, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface VoiceSupportProps {
  onSpeechResult?: (text: string) => void;
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
  disabled?: boolean;
  autoStop?: boolean;
  autoStopTime?: number;
  language?: string;
}

const VoiceSupport: React.FC<VoiceSupportProps> = ({
  onSpeechResult,
  onSpeechStart,
  onSpeechEnd,
  disabled = false,
  autoStop = true,
  autoStopTime = 10000,
  language = 'en-US',
}) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [recognition, setRecognition] = useState<any>(null);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = language;
      
      recognitionInstance.onstart = () => {
        setIsListening(true);
        if (onSpeechStart) onSpeechStart();
      };
      
      recognitionInstance.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        const currentTranscript = finalTranscript || interimTranscript;
        setTranscript(currentTranscript);
        
        if (finalTranscript && onSpeechResult) {
          onSpeechResult(finalTranscript);
        }
      };
      
      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          toast({
            title: "Microphone access denied",
            description: "Please allow microphone access to use voice features.",
            variant: "destructive",
          });
        }
        stopListening();
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
        if (onSpeechEnd) onSpeechEnd();
      };
      
      setRecognition(recognitionInstance);
    } else {
      toast({
        title: "Voice not supported",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive",
      });
    }
    
    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      setSpeechSynthesis(synth);
      
      const updateVoices = () => {
        const availableVoices = synth.getVoices();
        setVoices(availableVoices);
        
        // Try to find a voice in the user's language
        const langVoice = availableVoices.find(voice => voice.lang.includes(language.slice(0, 2)));
        if (langVoice) {
          setSelectedVoice(langVoice);
        } else if (availableVoices.length > 0) {
          setSelectedVoice(availableVoices[0]);
        }
      };
      
      if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = updateVoices;
      }
      
      // Initial voice loading
      updateVoices();
    } else {
      toast({
        title: "Text-to-speech not supported",
        description: "Your browser doesn't support text-to-speech.",
        variant: "destructive",
      });
    }
    
    // Clean up
    return () => {
      if (recognition) {
        recognition.stop();
      }
      if (speechSynthesis) {
        speechSynthesis.cancel();
      }
    };
  }, [language, onSpeechEnd, onSpeechResult, onSpeechStart]);
  
  // Auto-stop functionality
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    
    if (isListening && autoStop) {
      timer = setTimeout(() => {
        stopListening();
      }, autoStopTime);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isListening, autoStop, autoStopTime]);
  
  const startListening = () => {
    if (recognition && !isListening && !disabled) {
      setTranscript('');
      recognition.start();
    }
  };
  
  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };
  
  const speak = (text: string) => {
    if (speechSynthesis && selectedVoice) {
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = selectedVoice;
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsSpeaking(false);
      };
      
      speechSynthesis.speak(utterance);
    }
  };
  
  const stopSpeaking = () => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center space-x-2 mt-2">
        <Button
          onClick={isListening ? stopListening : startListening}
          variant={isListening ? "destructive" : "secondary"}
          size="sm"
          disabled={disabled}
          className={`rounded-full ${isListening ? 'animate-pulse-soft' : ''}`}
          aria-label={isListening ? "Stop listening" : "Start voice input"}
        >
          {isListening ? (
            <>
              <MicOff className="h-4 w-4 mr-1" />
              Stop
            </>
          ) : (
            <>
              <Mic className="h-4 w-4 mr-1" />
              Speak
            </>
          )}
        </Button>
        
        {transcript && (
          <Button
            onClick={() => speak(transcript)}
            variant="outline"
            size="sm"
            disabled={!transcript || isSpeaking}
            className="rounded-full"
            aria-label="Read transcript aloud"
          >
            {isSpeaking ? (
              <>
                <Volume2 className="h-4 w-4 mr-1 animate-pulse-soft" />
                Speaking...
              </>
            ) : (
              <>
                <Speaker className="h-4 w-4 mr-1" />
                Read
              </>
            )}
          </Button>
        )}
      </div>
      
      {transcript && (
        <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg w-full max-w-md">
          <p className="text-sm">{transcript}</p>
        </div>
      )}
      
      {isListening && (
        <p className="text-xs text-muted-foreground mt-1">
          Listening... {autoStop && `(will automatically stop in ${Math.round(autoStopTime / 1000)} seconds)`}
        </p>
      )}
    </div>
  );
};

export default VoiceSupport;
