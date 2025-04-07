import { 
  getMapData, 
  show3dMap, 
  MapView, 
  MapData, 
  TGetMapDataOptions, 
  TNavigationTarget 
} from '@mappedin/mappedin-js';
import '@mappedin/mappedin-js/lib/index.css';

// Global variables for voice instructions.
let instructionsOriginal: string[] = [];
let instructionsTranslated: string[] = [];
let currentInstructionIndex = 0;
let userSelectedLanguage = 'en-US';  // Default language for speech synthesis

// Mapping from our selector codes to MyMemory language codes.
const languageMapping: { [key: string]: string } = {
  'en-US': 'en',
  'fr-FR': 'fr',
  'de-DE': 'de',
  'es-ES': 'es',
  'it-IT': 'it',
  'pt-BR': 'pt'
};

// Translate a given text using MyMemory.
async function translateTextUsingMyMemory(text: string, targetLang: string): Promise<string> {
  const encodedText = encodeURIComponent(text);
  const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=en|${targetLang}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.responseData.translatedText;
}

// Update the translated instructions from the original ones.
async function updateTranslatedInstructions() {
  const targetLang = languageMapping[userSelectedLanguage] || 'en';
  if (targetLang === 'en') {
    // If English is selected, no translation is needed.
    instructionsTranslated = [...instructionsOriginal];
    currentInstructionIndex = 0;
    return;
  }
  const promises = instructionsOriginal.map(instr => translateTextUsingMyMemory(instr, targetLang));
  instructionsTranslated = await Promise.all(promises);
  currentInstructionIndex = 0; // Restart instructions on language change.
}

// Create a language selector with supported languages.
function createLanguageSelector() {
  let selector = document.getElementById('language-selector') as HTMLSelectElement;
  if (!selector) {
    selector = document.createElement('select');
    selector.id = 'language-selector';
    selector.style.position = 'fixed';
    selector.style.top = '10px';
    selector.style.left = '10px';
    selector.style.zIndex = '1000';
    const languages = [
      { code: 'en-US', name: 'English' },
      { code: 'fr-FR', name: 'French' },
      { code: 'de-DE', name: 'German' },
      { code: 'es-ES', name: 'Spanish' },
      { code: 'it-IT', name: 'Italian' },
      { code: 'pt-BR', name: 'Portuguese' }
    ];
    languages.forEach(lang => {
      const option = document.createElement('option');
      option.value = lang.code;
      option.textContent = lang.name;
      selector.appendChild(option);
    });
    selector.addEventListener('change', async (e) => {
      userSelectedLanguage = (e.target as HTMLSelectElement).value;
      if (instructionsOriginal.length > 0) {
        await updateTranslatedInstructions();
      }
    });
    document.body.appendChild(selector);
  }
}

// Create a "Read Next Instruction" button.
function createNextInstructionButton() {
  let button = document.getElementById("next-instruction-button");
  if (!button) {
    button = document.createElement("button");
    button.id = "next-instruction-button";
    button.style.position = "fixed";
    button.style.bottom = "160px";
    button.style.right = "10px";
    button.style.zIndex = "1000";
    button.textContent = "Read Next Instruction";
    document.body.appendChild(button);
  }
  button.onclick = () => {
    if (currentInstructionIndex < instructionsTranslated.length) {
      const utterance = new SpeechSynthesisUtterance(instructionsTranslated[currentInstructionIndex]);
      utterance.lang = userSelectedLanguage;
      window.speechSynthesis.speak(utterance);
      currentInstructionIndex++;
    }
  };
}

// Create a "Repeat Instruction" button.
function createRepeatInstructionButton() {
  let button = document.getElementById("repeat-instruction-button");
  if (!button) {
    button = document.createElement("button");
    button.id = "repeat-instruction-button";
    button.style.position = "fixed";
    button.style.bottom = "120px";
    button.style.right = "10px";
    button.style.zIndex = "1000";
    button.textContent = "Repeat Instruction";
    document.body.appendChild(button);
  }
  button.onclick = () => {
    let indexToRepeat = currentInstructionIndex > 0 ? currentInstructionIndex - 1 : 0;
    if (instructionsTranslated.length > 0) {
      const utterance = new SpeechSynthesisUtterance(instructionsTranslated[indexToRepeat]);
      utterance.lang = userSelectedLanguage;
      window.speechSynthesis.speak(utterance);
    }
  };
}

// Create a "Restart Directions" button.
function createRestartInstructionButton() {
  let button = document.getElementById("restart-instruction-button");
  if (!button) {
    button = document.createElement("button");
    button.id = "restart-instruction-button";
    button.style.position = "fixed";
    button.style.bottom = "80px";
    button.style.right = "10px";
    button.style.zIndex = "1000";
    button.textContent = "Restart Directions";
    document.body.appendChild(button);
  }
  button.onclick = () => {
    currentInstructionIndex = 0;
  };
}

// Mappedin API credentials and map ID.
const options: TGetMapDataOptions = {
  key: 'mik_VVPjnAIXcr8qoGMTc5512078f',
  secret: 'mis_KXM6oIhKkPzTSD3f2Y9fTuP9GAw0zfDvlve3xRRrQyq850e107b',
  mapId: '677733b351f079000b7dcf62',
};

// Read flight parameters from URL query string.
function getQueryParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    airport: urlParams.get('airport') || 'ORD',
    departure: urlParams.get('departure') || '2025-03-29',
    ident: urlParams.get('ident') || 'SKW5999'
  };
}

// Cache for flight info to prevent re-fetching.
let cachedFlightInfo: { gate: string; terminal: string } | null = null;

// Fetch flight info (gate and terminal) from the backend (with caching).
async function getFlightInfo() {
  if (cachedFlightInfo) {
    return cachedFlightInfo;
  }
  
  const { airport, departure, ident } = getQueryParameters();
  
  const res = await fetch('http://10.0.0.56:5000/get_flightData', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ airport, departure, ident })
  });
  const data = await res.json();
  
  cachedFlightInfo = { gate: data.gate, terminal: data.terminal };
  return cachedFlightInfo;
}

async function init() {
  createLanguageSelector();

  const { gate, terminal } = await getFlightInfo();

  // Get map data.
  const mapData: MapData = await getMapData(options);
  const mapView: MapView = await show3dMap(
    document.getElementById('mappedin-map') as HTMLDivElement,
    mapData
  );

  // Label all objects (spaces, POIs, etc.) for clarity.
  const labelableTypes = ['space', 'point-of-interest', 'enterprise-location', 'area', 'shape'];
  labelableTypes.forEach(type => {
    const items = mapData.getByType(type);
    items.forEach(item => {
      const labelText = (item as any).label || item.name;
      if (labelText) {
        mapView.Labels.add(item, labelText, type === 'shape' ? { className: 'small-label' } : undefined);
      }
    });
  });

  // Find the gate destination.
  let gateDestination = mapData.getByType('space').find(
    s => s.name && s.name.toLowerCase().includes(gate.toLowerCase())
  );
  if (!gateDestination) {
    gateDestination = mapData.getByType('point-of-interest').find(
      s => s.name && s.name.toLowerCase().includes(gate.toLowerCase())
    );
  }

  // Find the terminal destination.
  let terminalDestination = mapData.getByType('space').find(
    s => s.name &&
         s.name.toLowerCase().includes('terminal') &&
         s.name.toLowerCase().includes(terminal.toLowerCase())
  );
  if (!terminalDestination) {
    terminalDestination = mapData.getByType('point-of-interest').find(
      s => s.name &&
           s.name.toLowerCase().includes('terminal') &&
           s.name.toLowerCase().includes(terminal.toLowerCase())
    );
  }

  // Find the security destination.
  let securityDestination = mapData.getByType('space').find(
    s => s.name && s.name.toLowerCase().includes('security')
  );
  if (!securityDestination) {
    securityDestination = mapData.getByType('point-of-interest').find(
      s => s.name && s.name.toLowerCase().includes('security')
    );
  }

  if (!gateDestination || !terminalDestination || !securityDestination) {
    return;
  }

  // Get multi-segment directions: Terminal -> Security -> Gate.
  const multiSegmentDirections = mapData.getDirectionsMultiDestination(
    terminalDestination as TNavigationTarget,
    [securityDestination as TNavigationTarget, gateDestination as TNavigationTarget]
  );

  if (multiSegmentDirections && multiSegmentDirections.length > 0) {
    multiSegmentDirections.forEach((segment) => {
      // Draw the segment's path.
      mapView.Paths.add(segment.coordinates, {
        pathOptions: { nearRadius: 1, farRadius: 1 }
      });

      // Process each instruction: add a marker and store its text.
      if (segment.instructions && segment.instructions.length > 0) {
        segment.instructions.forEach((instruction: any) => {
          const instructionText = `${instruction.action.type} ${instruction.action.bearing ?? ''} in ${Math.round(instruction.distance)} meters.`.trim();
          if (instructionText.toLowerCase().startsWith("departure")) {
            return;
          }
          const markerTemplate = `
            <div class="marker">
              <p>${instructionText}</p>
            </div>`;
          mapView.Markers.add(instruction.coordinate, markerTemplate, { rank: 4 });
          instructionsOriginal.push(instructionText);
        });
      }
    });

    // Update the translated instructions using the current language.
    await updateTranslatedInstructions();

    // Re-add the terminal label.
    mapView.Labels.add(terminalDestination, terminalDestination.name, {
      className: 'small-label',
      forceDisplay: true 
    });

    // Create the voice buttons.
    createNextInstructionButton();
    createRepeatInstructionButton();
    createRestartInstructionButton();
  }
}

init();
