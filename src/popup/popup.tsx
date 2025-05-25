import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './popup.css';

const Popup = () => {
  const [template, setTemplate] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('FRENCH');

  const languages = [
    { value: 'FRENCH', label: 'Français' },
    { value: 'ENGLISH', label: 'English' },
    { value: 'ITALIAN', label: 'Italiano' },
    { value: 'SPANISH', label: 'Spanish' }
  ];

  // Load saved values when popup opens
  useEffect(() => {
    chrome.storage.local.get(['promptTemplate', 'openaiApiKey', 'selectedLanguage'], (result) => {
      if (result.promptTemplate) setTemplate(result.promptTemplate);
      if (result.openaiApiKey) setApiKey(result.openaiApiKey);
      if (result.selectedLanguage) setSelectedLanguage(result.selectedLanguage);
    });
  }, []);

  const handleSave = () => {
    chrome.storage.local.set({
      promptTemplate: template,
      openaiApiKey: apiKey,
      selectedLanguage: selectedLanguage
    }, () => {
      alert('Settings saved!');
    });
  };

  return (
    <div className="popup-container">
      <h2>Email AI Assistant</h2>
      
      {/* API Key Input */}
      <div className="input-group">
        <label htmlFor="apiKey">OpenAI API Key:</label>
        <input
          type="password"
          id="apiKey"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="sk-..."
        />
      </div>

      {/* Template Textarea */}
      <div className="input-group">
        <label htmlFor="template">Email Template:</label>
        <textarea 
          id="template"
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          placeholder="Enter your template here"
        />
      </div>

      {/* Language Dropdown */}
      <div className="input-group">
        <label htmlFor="language">Language:</label>
        <select
          id="language"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          {languages.map(lang => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleSave}>
        Save Settings
      </button>
    </div>
  );
};

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(<Popup />);
}