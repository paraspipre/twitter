import React, { useState } from "react";

interface EmotionSliderProps {
  labels: string[];
  initialIndex?: number;
  onChange: (label: string) => void;
}

const EmotionSlider: React.FC<EmotionSliderProps> = ({ labels, initialIndex = 2, onChange }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIndex = Number(e.target.value);
    setCurrentIndex(newIndex);
    onChange(labels[newIndex]);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex justify-between w-full text-sm text-gray-600">
        {labels.map((label, index) => (
          <span key={index}>{label}</span>
        ))}
      </div>
      <input
        type="range"
        min={0}
        max={labels.length - 1}
        step={1}
        value={currentIndex}
        onChange={handleChange}
        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-500"
      />
      {/* <div className="text-lg font-medium text-gray-800">{labels[currentIndex]}</div> */}
    </div>
  );
};

export default EmotionSlider;
