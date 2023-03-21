import * as itowns from 'itowns';
import * as THREE from 'three';


export default class Viewer3dTiles {
    constructor(domElement, extent, placement) {
        // ---------- CREATE A PlanarView : -------------------------------------

        this.view = new itowns.PlanarView(
            domElement,
            extent,
            { placement },
        );

        // ---------- DISPLAY CONTEXTUAL DATA : --------------------------------

        itowns.Fetcher.json('./res/layers/Ortho-Planar.json')
            .then((config) => {
                config.source.extent = extent;
                config.source = new itowns.WMSSource(config.source);
                config.updateStrategy = {
                    type: itowns.STRATEGY_DICHOTOMY,
                    options: {},
                },
                this.view.addLayer(
                    new itowns.ColorLayer(config.id, config),
                );
            });

        itowns.Fetcher.json('./res/layers/MNT-Planar.json')
            .then((config) => {
                config.source.extent = extent;
                config.source = new itowns.WMSSource(config.source);
                this.view.addLayer(
                    new itowns.ElevationLayer(config.id, config),
                );
            });

        // ---------- DISPLAY 3DTILES DATA : -------------------------------
        
        itowns.enableDracoLoader('./js/draco/');
        itowns.View.prototype.addLayer.call(
            this.view,
            new itowns.C3DTilesLayer(
                '3dTBuildings',
                {
                    source: new itowns.C3DTilesSource({
                        url: 'https://raw.githubusercontent.com/iTowns/'
                            + 'iTowns2-sample-data/master/3DTiles/'
                            + 'lyon_1_3946_textured_draco/tileset.json',
                        name: 'Lyon-2015-building',
                    }),
                },
                this.view,
            ),
        );
        
        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(-0.9, 0.3, 1);
        dirLight.updateMatrixWorld();
        this.view.scene.add( dirLight );

        const ambLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.view.scene.add( ambLight );
    }
}

