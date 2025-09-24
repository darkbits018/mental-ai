import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { chatAPI, quickActionAPI, getSettingsAPI, getHelpAPI, detectStressAPI, detectMoodAPI, getRecommendationsAPI } from './api';
import { Message, SidebarOption, ModelId } from './types';
import { ChatPage } from './ChatPage';
import { StressRecordPage } from './StressRecordPage';
import { MoodTrackPage } from './MoodTrackPage';

function App() {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi! How can I help you today?", isBot: true, timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeOption, setActiveOption] = useState<SidebarOption>('chat');
  const [selectedModel, setSelectedModel] = useState<ModelId>('x-ai/grok-4-fast:free'); // Default model

  const handleBotResponse = async (apiCall: Promise<string>, errorMessage: string) => {
    setIsLoading(true);
    try {
      const response = await apiCall;
      setMessages(prev => [...prev, { text: response, isBot: true, timestamp: new Date() }]);
    } catch (error) {
      console.error("API Error:", error);
      setMessages(prev => [...prev, { text: errorMessage, isBot: true, timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { text: input, isBot: false, timestamp: new Date() }]);
    setInput('');
    await handleBotResponse(
      chatAPI(userMessage, selectedModel),
      "Sorry, I'm having trouble connecting right now. Please try again."
    );
  };

  const handleQuickAction = async (action: string, displayText: string) => {
    setIsLoading(true);
    setMessages(prev => [...prev, { text: displayText, isBot: false, timestamp: new Date() }]);

    try {
      let botResponseText: string;
      if (action === 'detect_stress') {
        const response = await detectStressAPI(selectedModel);
        if (response.stress_level !== undefined && response.insights) {
          botResponseText = `Your stress level for today is **${response.stress_level}/10**. \n\n**Insights:** ${response.insights}`;
        } else {
          botResponseText = response.message || "I couldn't analyze your stress level right now.";
        }
      } else if (action === 'analyze_mood') {
        const response = await detectMoodAPI(selectedModel);
        if (response.mood && response.insights) {
          botResponseText = `Your primary mood for today seems to be **${response.mood}**. \n\n**Insights:** ${response.insights}`;
        } else {
          botResponseText = response.message || "I couldn't analyze your mood right now.";
        }
      } else if (action === 'recommend_music') {
        const response = await getRecommendationsAPI(selectedModel);
        if (response.spotify_url && response.youtube_url) {
          botResponseText = `Based on your recent entries, here are some recommendations:\n\n* [Listen on Spotify](${response.spotify_url})\n\n* [Watch on YouTube](${response.youtube_url})`;
        } else {
          botResponseText = response.message || "I couldn't get recommendations for you right now. Maybe try analyzing your mood or stress first?";
        }
      } else {
        botResponseText = await quickActionAPI(action, selectedModel);
      }
      setMessages(prev => [...prev, { text: botResponseText, isBot: true, timestamp: new Date() }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: "Sorry, I couldn't process that request right now.", isBot: true, timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSidebarOption = async (option: SidebarOption) => {
    setActiveOption(option);
    // If navigating away from chat, you might want to clear messages
    // or handle chat state saving here. For now, we'll just switch the view.
    if (option !== 'chat' && option !== 'help' && option !== 'settings') {
      setSidebarOpen(false);
      return;
    }

    // Keep chat-based actions for settings and help
    switch (option) {
      case 'chat':
        break;
      case 'settings':
        const settings = await getSettingsAPI();
        console.log('Settings:', settings);
        // Handle settings display
        break;
      case 'help':
        await handleBotResponse(
          getHelpAPI(),
          "Sorry, I couldn't fetch the help information right now."
        );
        break;
    }
  };

  const renderPage = () => {
    switch (activeOption) {
      case 'stress-record':
        return <StressRecordPage />;
      case 'mood-track':
        return <MoodTrackPage />;
      case 'chat':
      case 'settings':
      case 'help':
      default:
        return <ChatPage messages={messages} isLoading={isLoading} input={input} setInput={setInput} sendMessage={sendMessage} selectedModel={selectedModel} setSelectedModel={(model) => setSelectedModel(model as ModelId)} handleQuickAction={handleQuickAction} />;
    }
  }

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        handleSidebarOption={handleSidebarOption}
        activeOption={activeOption}
      />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <Header onMenuClick={() => setSidebarOpen(true)} />
        {renderPage()}
      </div>
    </div>
  );
}

export default App;
