import { getMapData, show3dMap, MapView, MapData, TGetMapDataOptions } from '@mappedin/mappedin-js';
import '@mappedin/mappedin-js/lib/index.css';

// Mappedin API credentials and map ID
const options: TGetMapDataOptions = {
  key: 'mik_VVPjnAIXcr8qoGMTc5512078f',
  secret: 'mis_KXM6oIhKkPzTSD3f2Y9fTuP9GAw0zfDvlve3xRRrQyq850e107b',
  mapId: '677733b351f079000b7dcf62',
};

async function init() {
  const mapData: MapData = await getMapData(options);
  const mapView: MapView = await show3dMap(
    document.getElementById('mappedin-map') as HTMLDivElement,
    mapData
  );

  // Define the object types you want to label, including shapes.
  const labelableTypes = [
    'space',
    'point-of-interest',
    'enterprise-location',
    'area',
    'shape'
  ];

  // Loop through each type and add labels.
  labelableTypes.forEach(type => {
    const items = mapData.getByType(type);
    items.forEach(item => {
      // Use a custom label if available; fallback to the object's name.
      const labelText = (item as any).label || item.name;
      if (labelText) {
        // For shapes, add a custom CSS class for smaller labels.
        if (type === 'shape') {
          mapView.Labels.add(item, labelText, { className: 'small-label' });
        } else {
          mapView.Labels.add(item, labelText);
        }
      }
    });
  });

  // Optional: click event for navigation example.
  mapView.on('click', async (event) => {
    const clickedLocation = event.coordinate;
    let destination = mapData.getByType('space').find((s) => s.name === 'G gate');
    if (!destination) {
      destination = mapData.getByType('point-of-interest').find((p) => p.name === 'G gate');
    }
    if (destination) {
      const directions = mapData.getDirections(clickedLocation, destination);
      if (directions) {
        mapView.Navigation.draw(directions, {
          pathOptions: {
            nearRadius: 1,
            farRadius: 1,
          },
        });
      }
    }
  });
}

init();
