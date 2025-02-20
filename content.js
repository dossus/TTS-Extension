chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'speak') {
      let utterance = new SpeechSynthesisUtterance(request.text);
      utterance.rate = 1.0;
      speechSynthesis.speak(utterance);
      sendResponse({status: 'speaking'});
    }
  });
  
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'speak') {
      let utterance = new SpeechSynthesisUtterance(request.text);
      utterance.rate = 1.0;
      speechSynthesis.speak(utterance);
      sendResponse({status: 'speaking'});
    } else if (request.action === 'stop') {
      speechSynthesis.cancel();
      sendResponse({status: 'stopped'});
    }
  });
  