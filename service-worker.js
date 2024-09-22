chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
// ENTRY POINT IS HERE.  RETRIEVE ANY TEXT AND DISPLAY IT.
loadChanges();

// Store data in the sync storage area rather than local.
const storage = chrome.storage.sync;

// Get at the DOM controls
const saveButton = document.querySelector('button.saveButton');
const reloadButton = document.querySelector('button.reloadButton');
const deleteButton = document.querySelector('button.deleteButton');
const reloadIcon = document.querySelector('button.reloadIcon');
const copyButton = document.querySelector('button.copyButton');
const speakButton = document.querySelector('button.speakButton');
const textarea = document.querySelector('textarea');

// Add event listeners for when buttons are clicked
saveButton.addEventListener('click', saveChanges);
reloadButton.addEventListener('click', loadChanges);
deleteButton.addEventListener('click', deleteChanges);
reloadIcon.addEventListener('click', loadChanges);
copyButton.addEventListener('click', copyChanges);
speakButton.addEventListener('click', speakChanges);

async function saveChanges() {  
  textToSave = textarea.value;

  // Url the user is on.
  let [tab] = await chrome.tabs.query({  active: true, lastFocusedWindow: true });
  let key = tab.url;

  // Dynamically create an object with the URL as the key
  let dataToSave = {};
  dataToSave[key] = textToSave;

  // Save the data
  chrome.storage.sync.set(dataToSave);

  // Close the sidepanel
  chrome.runtime.reload()
}

async function loadChanges() {
  // Url the user is on.
  let [tab] = await chrome.tabs.query({ active: true, 
                                        lastFocusedWindow: true });
  let key = tab.url;

  // Retrieve the saved data for the current URL and display it.
  storage.get(key, function (items) {
    if (items[key]) {
      textarea.value = items[key];      
    } else {
      textarea.value = "";
    }  
  });
}

async function deleteChanges() {
  // Url the user is on.
  let [tab] = await chrome.tabs.query({  active: true, lastFocusedWindow: true });
  let key = tab.url;
  
  await storage.remove(key);
  
  // Refresh the text area.
  textarea.value = '';
}

// Background theme toggle logic
// Add event listener for theme button click
const themeButton = document.querySelector('button.themeButton');
themeButton.addEventListener('click', changeTheme);

function changeTheme() {
  const textContainer = document.getElementById('displayText');
  if (textContainer.classList.contains('light-theme')) {
    textContainer.classList.remove('light-theme');
    textContainer.classList.add('dark-theme');
    document.getElementById('themeToggle').innerText = 'Light Theme';
  } else {
    textContainer.classList.remove('dark-theme');
    textContainer.classList.add('light-theme');
    document.getElementById('themeToggle').innerText = 'Dark Theme';
  }

}

// Copy contents to clipboard
async function copyChanges() {
  await navigator.clipboard.writeText(textarea.value);
}

// Convert text to audio.
function speakChanges() {
  chrome.tts.speak(textarea.value, {
    'rate': 1.0,  
    'pitch': 1.0,  
    'lang': 'en-US',  
  });  
}
