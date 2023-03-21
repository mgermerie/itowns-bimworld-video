import * as itowns from 'itowns';
import * as proj4 from 'proj4';
import ViewerMVT from './ViewerMVT.js';
import Viewer3dTiles from './Viewer3dTiles.js';
import AnimationManager from './AnimationManager.js';


switch (VIEWER_TYPE) {
    case 'MVT':
        placement.coord = new itowns.Coordinates(
            placement.coord.crs,
            placement.coord.x,
            placement.coord.y,
        );

        const viewerMVT = new ViewerMVT(
            document.getElementById('viewerDiv'),
            placement,
        );

        new AnimationManager(
            viewerMVT.view,
            './res/travelSteps-MVT.json',
        );

        break;
    case '3dTiles':
        proj4.default.defs(
            'EPSG:3946',
            '+proj=lcc +lat_1=45.25 +lat_2=46.75 +lat_0=46 +lon_0=3'
                + ' +x_0=1700000 +y_0=5200000 +ellps=GRS80'
                + ' +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
        );
        placement.coord = new itowns.Coordinates(
            placement.coord.crs,
            placement.coord.x,
            placement.coord.y,
            placement.coord.z,
        );

        const viewer3dTiles = new Viewer3dTiles(
            document.getElementById('viewerDiv'),
            new itowns.Extent(extent.crs, extent.boundaries),
            placement,
        );

        new AnimationManager(
            viewer3dTiles.view,
            './res/travelSteps-3dTiles.json',
        );

        break;
    default:
        console.warn('no use case specified');
        break;
}

