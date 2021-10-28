import { Lights } from "./lights";


export class Enemy {
    private scene: BABYLON.Scene;
    public playerMesh: BABYLON.Mesh;
    public id: string;


    constructor(scene: BABYLON.Scene, id: string) {
        this.scene = scene;
        this.id = id;
    }

    public init(lights: Lights) {
        this.playerMesh = BABYLON.Mesh.CreateSphere("enemy_obj", 12, 4, this.scene);

        var playerMaterial = new BABYLON.StandardMaterial("player_material", this.scene);
        playerMaterial.diffuseTexture = new BABYLON.Texture("public/assets/textures/basketball.jpg", this.scene);
 
        this.playerMesh.material = playerMaterial;

        this.playerMesh.physicsImpostor = new BABYLON.PhysicsImpostor(
            this.playerMesh,
            BABYLON.PhysicsImpostor.SphereImpostor, {
                mass: 1,
                friction: 100
            }, this.scene);

        lights.addShadowCaster(this.playerMesh);
    } 

    public update(linearVelocity: BABYLON.Vector3, angularVelocity: BABYLON.Vector3, position: BABYLON.Vector3){
        this.playerMesh.physicsImpostor.setAngularVelocity(angularVelocity);
        this.playerMesh.physicsImpostor.setLinearVelocity(linearVelocity);
        this.playerMesh.position = position;
    }
}