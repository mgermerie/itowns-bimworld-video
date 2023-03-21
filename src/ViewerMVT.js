import * as itowns from 'itowns';


export default class ViewerMVT {
    constructor(domElement, placement) {
        // ---------- CREATE A GlobeView : -------------------------------------

        this.view = new itowns.GlobeView(
            domElement,
            placement,
        );

        // ---------- DISPLAY CONTEXTUAL DATA : --------------------------------

        itowns.Fetcher.json('./res/layers/Ortho-Globe.json')
            .then((config) => {
                config.source = new itowns.WMTSSource(config.source);
                this.view.addLayer(
                    new itowns.ColorLayer(config.id, config),
                );
            });

        itowns.Fetcher.json('./res/layers/MNT-Globe.json')
            .then((config) => {
                config.source = new itowns.WMTSSource(config.source);
                this.view.addLayer(
                    new itowns.ElevationLayer(config.id, config),
                );
            });

        // ---------- DISPLAY VECTOR TILE DATA : -------------------------------
        
        this.view.addLayer(
            new itowns.FeatureGeometryLayer('VTBuildings', {
                source: new itowns.VectorTilesSource({
                    style: 'https://wxs.ign.fr/essentiels/static/vectorTiles/'
                        + 'styles/PLAN.IGN/standard.json',
                    filter: (layer) => {
                        return layer['source-layer'].includes('bati_surf')
                            && layer.paint['fill-color'];
                    },
                }),
                zoom: { min: 15 },
                acurate: false,
                style: new itowns.Style({
                    fill: {
                        base_altitude: (p) => p.alti_sol || 0,
                        extrusion_height: (p) => p.hauteur || 0,
                    },
                }),
            }),
        );
    }
}

