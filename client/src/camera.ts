export class Camera {
    //Members
    private camera: BABYLON.ArcRotateCamera;
    private scene: BABYLON.Scene;
    private followMesh: BABYLON.Mesh;
    private canvas: any;
    private radius: number = 40; 

    constructor(scene: BABYLON.Scene) {
        this.scene = scene;
        this.canvas = scene.getEngine().getRenderingCanvas();
    } 

    public init(playerMesh: BABYLON.Mesh) {
        this.camera = new BABYLON.ArcRotateCamera("player_camera", 1, 1.4, this.radius, playerMesh.position, this.scene);
        this.camera.lowerRadiusLimit = 0.5;
        this.camera.upperRadiusLimit = 100;
        //this.camera.attachControl(this.canvas, true);

        this.followMesh = playerMesh;

        // Lock cursor
        this.canvas.addEventListener("click", (evt) => {
            this.canvas.requestPointerLock = this.canvas.requestPointerLock ||
                this.canvas.msRequestPointerLock ||
                this.canvas.mozRequestPointerLock ||
                this.canvas.webkitRequestPointerLock;
            if (this.canvas.requestPointerLock) {
                this.canvas.requestPointerLock();
            }
        }, false);

        // Attach events to the document
        document.addEventListener("pointerlockchange", (evt) => this.pointerlockchange(evt), false);
        document.addEventListener("mspointerlockchange", (evt) => this.pointerlockchange(evt), false);
        document.addEventListener("mozpointerlockchange", (evt) => this.pointerlockchange(evt), false);
        document.addEventListener("webkitpointerlockchange", (evt) => this.pointerlockchange(evt), false);
    }

    // Event listener when the pointerlock is updated (or removed by pressing ESC for example).
    private pointerlockchange(event: Event) {
        let controlEnabled: boolean = (
            document.mozPointerLockElement === this.canvas
            || document.webkitPointerLockElement === this.canvas
            || document.msPointerLockElement === this.canvas
            || document.pointerLockElement === this.canvas);
        // If the user is alreday locked
        if (!controlEnabled) {
            //this.camera.detachControl(this.canvas);
        } else {
            //this.camera.attachControl(this.canvas, true);
        }
    };

    public getCamDirection(): BABYLON.Vector3 {
        return this.camera.getTarget().subtract(this.camera.position).normalize();
    }

    public changeCameraRotation(deltaAlpha: number = null, deltaBeta: number = null){
        if(deltaAlpha !== null){
            let newAlpha: number = this.camera.alpha + deltaAlpha;
            this.camera.alpha = newAlpha;
        }
    }

    public followCamera() {
        let newTarget: BABYLON.Vector3 = this.followMesh.position.clone();
        newTarget.y += 2;
        let alpha: number = this.camera.alpha;
        let beta: number = this.camera.beta;
        this.camera.target = newTarget;
        this.camera.radius = this.radius;
        this.camera.beta = beta;
        this.camera.alpha = alpha;
    }
}