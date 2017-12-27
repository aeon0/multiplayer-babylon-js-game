//import { SocketService } from "./routing/socket.service";
import { Camera } from "./camera";
import { Lights } from "./lights";
import { RouterService } from "./routing/router.service";


const LEFT: number = 65; // A
const RIGHT: number = 68; // D
const UP: number = 87; // W
const DOWN: number = 83; // S
const JUMP: number = 32; // Spacebar 

export class Player {
    private scene: BABYLON.Scene;
    private keyDown: object = {};
    public playerMesh: BABYLON.Mesh;
    public id: string;

    constructor(scene: BABYLON.Scene, id: string) {
        this.scene = scene;
        this.id = id;
    }

    public init(lights: Lights) {
        this.playerMesh = BABYLON.Mesh.CreateSphere("player_obj", 12, 4, this.scene);
        this.playerMesh.position.y = 16;

        var playerMaterial = new BABYLON.StandardMaterial("player_material", this.scene);
        playerMaterial.diffuseTexture = new BABYLON.Texture("public/assets/textures/green_tennis_ball.jpg", this.scene);
 
        this.playerMesh.material = playerMaterial;

        this.playerMesh.physicsImpostor = new BABYLON.PhysicsImpostor(
            this.playerMesh,
            BABYLON.PhysicsImpostor.SphereImpostor, {
                mass: 1,
                friction: 100
            }, this.scene);
        
        lights.addShadowCaster(this.playerMesh);

        // Register event listener for keys
        window.addEventListener('keydown', (event: KeyboardEvent) => { this.keyDownEvt(event); }, false);
        window.addEventListener('keyup', (event: KeyboardEvent) => { this.keyUpEvt(event); }, false);
    } 

    private keyDownEvt(evt: KeyboardEvent) {
        //SocketService.test();
        this.keyDown[evt.keyCode] = true;
    }

    private keyUpEvt(evt: KeyboardEvent) {
        this.keyDown[evt.keyCode] = false;
    }

    public applyMovement(camera: Camera, deltaTime: number){
        let contactPoint: BABYLON.Vector3 = this.playerMesh.absolutePosition.clone();
        contactPoint.y += 20;
        let force: number = 0.002 * deltaTime;  // That means a maximum of 20 force / second
        let direction: BABYLON.Vector3 = camera.getCamDirection().multiplyByFloats(force, force, force);
        if(this.keyDown[UP]){
            this.playerMesh.applyImpulse(direction, contactPoint);
            RouterService.sendInteraction(camera.getCamDirection(), force);
        }
        if(this.keyDown[DOWN]){
            this.playerMesh.applyImpulse(direction.negate(), contactPoint);
            RouterService.sendInteraction(camera.getCamDirection().negate(), force);
        }
        if(this.keyDown[LEFT]){
            camera.changeCameraRotation(0.06);
        }
        if(this.keyDown[RIGHT]){
            camera.changeCameraRotation(-0.06);
        }
        if(this.keyDown[JUMP]){
            // Test if ball is on the ground... not sure how to do that...
            //let rayPick = new BABYLON.Ray(this.playerMesh.position, new BABYLON.Vector3(0, -1, 0));
            //let counter = 0;
             
            // Well then lets just jump around if y < 5
            console.log(this.playerMesh.position);
            if(this.playerMesh.position.y < 3){
                let jump_direction = new BABYLON.Vector3(0, 70, 0);
                let jump: BABYLON.Vector3 = jump_direction.multiplyByFloats(force, force, force);
                this.playerMesh.applyImpulse(direction.negate(), this.playerMesh.absolutePosition);
                RouterService.sendInteraction(jump_direction, force);
            }

        }
    }

    public update(linearVelocity: BABYLON.Vector3, angularVelocity: BABYLON.Vector3, position: BABYLON.Vector3){
        this.playerMesh.physicsImpostor.setAngularVelocity(angularVelocity);
        this.playerMesh.physicsImpostor.setLinearVelocity(linearVelocity);
        this.playerMesh.position = position;
    }
}