import { getMapData, show3dMap, MapView, MapData, TGetMapDataOptions, Space } from '@mappedin/mappedin-js';
import '@mappedin/mappedin-js/lib/index.css';

// Mappedin API credentials and map ID
const options: TGetMapDataOptions = {
  key: 'mik_VVPjnAIXcr8qoGMTc5512078f',
  secret: 'mis_KXM6oIhKkPzTSD3f2Y9fTuP9GAw0zfDvlve3xRRrQyq850e107b',
  mapId: '677733b351f079000b7dcf62',
};
async function init() {
  const mapData: MapData = await getMapData(options);
  const mapView: MapView = await show3dMap(document.getElementById('mappedin-map') as HTMLDivElement, mapData);
  const firstSpace = mapData
    .getByType('space')
    .find((s) => s.name === 'Terminal 2') as Space;

  // Gate E Space
  const secondSpace = mapData
    .getByType('space')
    .find((s) => s.name === 'G gate') as Space;

  // Label terminal 2 and gate e spaces
  
  
  mapView.on('click', async (event) => {
    const clickedLocation = event.coordinate;
    const destination = mapData.getByType('space').find((s) => s.name === 'G gate');
  
    // If the destination is found, navigate to it.
    if (destination) {
      //Ensure that directions could be generated (user clicked on a navigable space).
      const directions = mapData.getDirections(clickedLocation, destination);
  
      if (directions) {
        // Navigate from the clicked location to the gymnasium.
        mapView.Navigation.draw(directions, {
          pathOptions: {
            nearRadius: 1,
            farRadius: 1,
          },
        });
      }
    }
  });

  mapView.Labels.add(firstSpace, firstSpace.name);
  mapView.Labels.add(secondSpace, secondSpace.name);

}


init();
