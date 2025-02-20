// context menu item
chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
      id: "readText",
      title: "Read Aloud",
      contexts: ["selection"]
    });
  });
  
  //Click Event Listener
chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === "readText") {
    chrome.tabs.executeScript(tab.id, {
      code: 'window.getSelection().toString();'
    }, function(selection) {
      let selectedText = selection[0];
      if (selectedText) {
        speakText(selectedText);
      } else {
        alert("No text selected.");
      }
    });
  }
});

// function to split and speak text chunks
function speakText(text) {
  const maxChunkLength = 200; 
  const txtLength = text.length;
  let currentIndex = 0;

  function speakChunk() {
    if (currentIndex < txtLength) {
      let chunk = text.substr(currentIndex, maxChunkLength);
      // to not split words up between chunks
      const lastSpaceIndex = chunk.lastIndexOf(' ');
      if (lastSpaceIndex > -1 && currentIndex + maxChunkLength < txtLength) {
        chunk = chunk.substr(0, lastSpaceIndex);
      }
      currentIndex += chunk.length;
        //speech settings here
      chrome.tts.speak(chunk, {
        rate: 1.5,
        volume: 1.0,
        lang: 'en-US',
        voiceName: 'Google US English',
        onEvent: function(event) {
          if (event.type === 'end' || event.type === 'error') {
            speakChunk();
          }
        }
      });
    }
  }

  speakChunk();
}

chrome.tabs.executeScript(tab.id, {
  code:
    (() => {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const container = document.createElement('div');
        for (let i = 0; i < selection.rangeCount; i++) {
          container.appendChild(selection.getRangeAt(i).cloneContents());
        }
        return container.innerText;
      }
      return '';
    })()

}, function(selection) {
  let selectedText = selection[0];
  if (selectedText) {
    speakText(selectedText);
  } else {
    alert("No text selected.");
  }
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === "readText") {
    chrome.tabs.executeScript(tab.id, {
      code: 'window.getSelection().toString();'
    }, function(selection) {
      let selectedText = selection[0];
      if (selectedText) {
        chrome.tabs.sendMessage(tab.id, {action: 'speak', text: selectedText}, function(response) {
          console.log(response.status);
        });
      } else {
        alert("No text selected.");
      }
    });
  }
});

// on install
chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    id: "readText",
    title: "Read Aloud",
    contexts: ["selection"]
  });
  chrome.contextMenus.create({
    id: "stopReading",
    title: "Stop Reading",
    contexts: ["all"]
  });
});

// handle menu clicks
chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === "readText") {
  } else if (info.menuItemId === "stopReading") {
    chrome.tabs.sendMessage(tab.id, {action: 'stop'}, function(response) {
      console.log(response.status);
    });
  }
});

if (selectedText.length > MAX_TEXT_LENGTH) {
  alert("Selected text is too long. Please select a shorter passage.");
} else {
  speakText(selectedText);
}

selectedText = selectedText.replace(/\s+/g, ' ').trim();