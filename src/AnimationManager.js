import * as itowns from 'itowns';


export default class AnimationManager {
    #travelOn = false;
    #steps = [];
    #stepsCandidates = [];
    #view;

    constructor(view, animationFile) {
        this.#view = view;

        itowns.Fetcher.json(animationFile)
            .then((fetchedData) => {
                if (!Object.keys(fetchedData).length) { return; }
                const steps = fetchedData.steps;

                steps[0].time = 0;
                steps[1].easing = itowns.CameraUtils.Easing.Quadratic.In;

                for (const step of steps) {
                    step.coord = new itowns.Coordinates(
                        step.coord.crs,
                        step.coord.x,
                        step.coord.y,
                        step.coord.z,
                    );
                    step.time = step.time ?? fetchedData.time ?? 5000;
                    step.easing = step.easing
                        ?? itowns.CameraUtils.Easing.Linear.None;
                }
                this.#steps.push(...steps);
            });

        const onKeyPressHandler = this.onKeyPress.bind(this);
        window.addEventListener('keypress', onKeyPressHandler, false);
    }

    travel(steps) {
        if (!this.#travelOn) {
            this.#travelOn = true;
            return itowns.CameraUtils.sequenceAnimationsToLookAtTarget(
                this.#view,
                this.#view.camera.camera3D,
                steps
            ).then(() => { this.#travelOn = false; });
        }
        itowns.CameraUtils.stop(
            this.#view,
            this.#view.camera.camera3D,
        );
    }

    onKeyPress(event) {
        switch (event.key) {
            case 'a':
                this.travel(this.#steps);
                break;

            case 'w':
                console.log(
                    `{"steps":${JSON.stringify(this.#stepsCandidates)}}`,
                );
                break;

            case 'p':
                this.#stepsCandidates.push(
                    itowns.CameraUtils.getTransformCameraLookingAtTarget(
                        this.#view,
                        this.#view.camera.camera3D,
                    ),
                );
                break;

            default:
                break;
        }
    }
}

