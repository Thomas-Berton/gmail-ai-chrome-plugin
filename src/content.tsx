import React from "react";
import { createRoot } from "react-dom/client";
import AIButton from "./components/AIButton";

// Debounce function to prevent rapid re-injection
const debounce = (func: Function, wait: number) => {
  let timeout: number | undefined;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = window.setTimeout(later, wait);
  };
};

// Rest of your code remains the same
const injectAIButton = () => {
  const existingButton = document.getElementById('ai-assistant-root');
  const buttonContainer = document.querySelector('.Ap');
  
  if (existingButton && existingButton.parentElement === buttonContainer) {
    return;
  }

  existingButton?.remove();
  
  if (buttonContainer && !document.getElementById('ai-assistant-root')) {
    const aiButtonContainer = document.createElement('div');
    aiButtonContainer.id = 'ai-assistant-root';
    aiButtonContainer.style.display = 'inline-block';
    aiButtonContainer.style.marginTop = '8px';
    
    buttonContainer.insertBefore(aiButtonContainer, buttonContainer.firstChild);
    
    const root = createRoot(aiButtonContainer);
    root.render(<AIButton />);
  }
};

// Debounced version of injectAIButton
const debouncedInjectAIButton = debounce(injectAIButton, 100);

const observeGmail = () => {
  const mainObserver = new MutationObserver((mutations) => {
    let shouldInject = false;
    
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          if (node.classList.contains('AD') || node.querySelector('.Ap')) {
            shouldInject = true;
          }
        }
      });
    });

    if (shouldInject) {
      debouncedInjectAIButton();
    }
  });

  mainObserver.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Less frequent checks for existing compose windows
  const checkExistingComposeWindows = () => {
    const composeWindows = document.querySelectorAll('.AD');
    if (composeWindows.length > 0) {
      debouncedInjectAIButton();
    }
  };

  // Check less frequently (every 2 seconds instead of every second)
  setInterval(checkExistingComposeWindows, 2000);

  // Handle URL changes
  const originalPushState = history.pushState;
  history.pushState = function(state: any, title: string, url?: string | URL | null) {
    originalPushState.call(history, state, title, url);
    debouncedInjectAIButton();
  };

  window.addEventListener('popstate', () => {
    debouncedInjectAIButton();
  });
};

const initialize = () => {
  console.log("Gmail AI Assistant initialized");
  debouncedInjectAIButton();
  observeGmail();
};

// Wait for Gmail to load (only once)
const waitForGmail = () => {
  if (document.querySelector(".gU.Up")) {
    initialize();
    return;
  }

  const intervalId = setInterval(() => {
    if (document.querySelector(".gU.Up")) {
      clearInterval(intervalId);
      initialize();
    }
  }, 100);
};

// Start initialization (only need one of these)
waitForGmail();