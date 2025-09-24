interface QuickActionsProps {
  handleQuickAction: (action: string, displayText: string) => void;
  isLoading: boolean;
}

const actions = [
  { action: "detect_stress", label: "Detect Stress", displayText: "Can you detect my stress level?" },
  { action: "analyze_mood", label: "Analyze Mood", displayText: "Analyze my current mood" },
  { action: "recommend_music", label: "Recommend Music", displayText: "Recommend some music for me" },
];

export function QuickActions({ handleQuickAction, isLoading }: QuickActionsProps) {
  return (
    <div className="flex gap-2 justify-start overflow-x-auto whitespace-nowrap py-1">
      {actions.map(({ action, label, displayText }) => (
        <button
          key={action}
          onClick={() => handleQuickAction(action, displayText)}
          disabled={isLoading}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
        >
          {label}
        </button>
      ))}
    </div>
  );
}