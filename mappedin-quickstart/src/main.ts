import { 
    getMapData, 
    show3dMap, 
    MapView, 
    MapData, 
    TGetMapDataOptions, 
    TNavigationTarget 
  } from '@mappedin/mappedin-js';
  import '@mappedin/mappedin-js/lib/index.css';
  
  // On-screen logging function for debugging
  function logToScreen(message: string) {
    let logContainer = document.getElementById('log-container');
    if (!logContainer) {
      logContainer = document.createElement('div');
      logContainer.id = 'log-container';
      logContainer.style.position = 'fixed';
      logContainer.style.bottom = '0';
      logContainer.style.left = '0';
      logContainer.style.width = '100%';
      logContainer.style.backgroundColor = 'rgba(0,0,0,0.8)';
      logContainer.style.color = 'white';
      logContainer.style.fontSize = '12px';
      logContainer.style.maxHeight = '150px';
      logContainer.style.overflowY = 'auto';
      logContainer.style.padding = '5px';
      document.body.appendChild(logContainer);
    }
    const p = document.createElement('p');
    p.textContent = message;
    logContainer.appendChild(p);
  }
  
  // Mappedin API credentials and map ID
  const options: TGetMapDataOptions = {
    key: 'mik_VVPjnAIXcr8qoGMTc5512078f',
    secret: 'mis_KXM6oIhKkPzTSD3f2Y9fTuP9GAw0zfDvlve3xRRrQyq850e107b',
    mapId: '677733b351f079000b7dcf62',
  };
  
  // Read flight parameters from URL query string
  function getQueryParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      airport: urlParams.get('airport') || 'ORD',
      departure: urlParams.get('departure') || '2025-03-29',
      ident: urlParams.get('ident') || 'SKW5999'
    };
  }
  
  // Fetch flight info (gate and terminal) from the backend
  async function getFlightInfo() {
    const { airport, departure, ident } = getQueryParameters();
    logToScreen(`Using query params: airport=${airport}, departure=${departure}, ident=${ident}`);
    
    const res = await fetch('http://10.0.0.56:5000/get_flightData', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ airport, departure, ident })
    });
    const data = await res.json();
    logToScreen(`Fetched flight info: gate=${data.gate}, terminal=${data.terminal}`);
    return { gate: data.gate, terminal: data.terminal };
  }
  
  async function init() {
    const { gate, terminal } = await getFlightInfo();
  
    const mapData: MapData = await getMapData(options);
    const mapView: MapView = await show3dMap(
      document.getElementById('mappedin-map') as HTMLDivElement,
      mapData
    );
  
    // Label all objects (spaces, POIs, etc.) for clarity
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
  
    // Find the gate destination: search spaces then points-of-interest
    let gateDestination = mapData.getByType('space').find(
      s => s.name && s.name.toLowerCase().includes(gate.toLowerCase())
    );
    if (!gateDestination) {
      gateDestination = mapData.getByType('point-of-interest').find(
        s => s.name && s.name.toLowerCase().includes(gate.toLowerCase())
      );
    }
  
    // Find the terminal destination
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
  
    // Find the security destination
    let securityDestination = mapData.getByType('space').find(
      s => s.name && s.name.toLowerCase().includes('security')
    );
    if (!securityDestination) {
      securityDestination = mapData.getByType('point-of-interest').find(
        s => s.name && s.name.toLowerCase().includes('security')
      );
    }
  
    logToScreen(`Gate found: ${gateDestination?.name}`);
    logToScreen(`Terminal found: ${terminalDestination?.name}`);
    logToScreen(`Security found: ${securityDestination?.name}`);
  
    if (!gateDestination || !terminalDestination || !securityDestination) {
      logToScreen("❌ Could not find gate, terminal, or security on the map.");
      return;
    }
  
    // Create multi-segment directions: Terminal -> Security -> Gate
    const multiSegmentDirections = mapData.getDirectionsMultiDestination(
      terminalDestination as TNavigationTarget,
      [securityDestination as TNavigationTarget, gateDestination as TNavigationTarget]
    );
  
    logToScreen(`Multi-segment directions found: ${multiSegmentDirections.length} segment(s)`);
  
    if (multiSegmentDirections && multiSegmentDirections.length > 0) {
      // Draw all segments at once – this ensures the entire path is rendered as a single route.
      mapView.Navigation.draw(multiSegmentDirections, {
        pathOptions: { nearRadius: 1, farRadius: 1 },
      });
      logToScreen("✅ Multi-segment directions drawn");
    } else {
      logToScreen("⚠️ No multi-segment directions found to draw");
    }
  
    // Optional: click-to-navigate example
    mapView.on('click', async (event) => {
      const clickedLocation = event.coordinate;
      let destination = mapData.getByType('space').find(
        s => s.name === 'G gate'
      ) || mapData.getByType('point-of-interest').find(
        p => p.name === 'G gate'
      );
      if (destination) {
        const clickDirections = mapData.getDirections(clickedLocation, destination);
        if (clickDirections) {
          mapView.Navigation.draw(clickDirections, {
            pathOptions: { nearRadius: 1, farRadius: 1 }
          });
          logToScreen("✅ Click navigation drawn to G gate");
        }
      }
    });
  }
  
  init();
  