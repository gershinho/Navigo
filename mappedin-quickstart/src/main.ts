import { getMapData, show3dMap, MapView, MapData, TGetMapDataOptions } from '@mappedin/mappedin-js';
import '@mappedin/mappedin-js/lib/index.css';

// Mappedin API credentials and map ID
const options: TGetMapDataOptions = {
  key: 'mik_VVPjnAIXcr8qoGMTc5512078f',
  secret: 'mis_KXM6oIhKkPzTSD3f2Y9fTuP9GAw0zfDvlve3xRRrQyq850e107b',
  mapId: '677733b351f079000b7dcf62',
};

async function init() {
  const mapData = await getMapData(options);
  const mapView = await show3dMap(
    document.getElementById('mappedin-map'),
    mapData
  );

  // New color assignments
  const t2Color = '#fae8ca'; // Light pastel color for T2
  const checkpointColor = '#ffda99'; // Soft yellow for security checkpoints
  const gateColor = '#ffe4b5'; // Light yellow for gates
  const gateRoomColor = '#ffd699'; // Slightly darker yellow for rooms inside gates
  const lightGrey = '#f0f0f0'; // Light grey for non-named spaces

  // Custom color assignments for key named spaces
  const spaceColorOverrides: Record<string, string> = {
    'T2': t2Color,
    'E Gate': gateColor,
    'F Gate': gateColor,
    'G Gate': gateColor,
    'Security Checkpoint': checkpointColor,
  };

  // Assign colors to spaces, with darker shades for rooms inside gates
  const allSpaces = mapData.getByType('space');
  allSpaces.forEach((space) => {
    let color = spaceColorOverrides[space.name] || lightGrey; // Default to light grey for non-named spaces
    if (['E Gate', 'F Gate', 'G Gate'].includes(space.name)) {
      // Darker shade for rooms inside gates (only for rooms under "E Gate", "F Gate", "G Gate")
      mapView.updateState(space, {
        color: gateRoomColor,
        hoverColor: gateRoomColor,
        interactive: true,
      });
    } else {
      mapView.updateState(space, {
        color: color,
        hoverColor: color,
        interactive: true,
      });
    }
  });

  // Labels
  const labelableTypes = ['space', 'point-of-interest', 'enterprise-location', 'area', 'shape'];
  labelableTypes.forEach(type => {
    const items = mapData.getByType(type);
    items.forEach(item => {
      const labelText = item.label || item.name;
      if (labelText) {
        const labelOptions = {
          className: type === 'shape' ? 'small-label' : 'default-label',
          style: {
            color: '#C56B2E',
            fontWeight: 'bold',
            fontSize: '16px',
          },
          options: { interactive: true },
        };
        mapView.Labels.add(item, labelText, labelOptions);
      }
    });
  });

  // Click navigation to "G Gate"
  mapView.on('click', async (event) => {
    const clickedLocation = event.coordinate;
    let destination = mapData.getByType('space').find(s => s.name === 'G Gate');
    if (!destination) {
      destination = mapData.getByType('point-of-interest').find(p => p.name === 'G Gate');
    }
    if (destination) {
      const directions = mapData.getDirections(clickedLocation, destination);
      if (directions) {
        mapView.Navigation.draw(directions, {
          pathOptions: {
            nearRadius: 1,
            farRadius: 1,
            pathColor: '#D87E3B', // Warm color for the path
            pathWidth: 5,
          },
        });
      }
    }
  });
}

init();
