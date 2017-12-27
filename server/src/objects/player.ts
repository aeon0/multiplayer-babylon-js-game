export class Player {
    private scene: BABYLON.Scene;
    public playerMesh: BABYLON.Mesh;

    constructor(scene: BABYLON.Scene) {
        this.scene = scene;
    }

    public init(name: string) {
        this.playerMesh = BABYLON.Mesh.CreateSphere(name, 12, 4, this.scene);

        this.playerMesh.position.y = 16;
        this.playerMesh.position.x = Math.floor(Math.random() * 30) - 30;
        this.playerMesh.position.z = Math.floor(Math.random() * 30) - 30; 

        this.playerMesh.physicsImpostor = new BABYLON.PhysicsImpostor(
            this.playerMesh,
            BABYLON.PhysicsImpostor.SphereImpostor, {
                mass: 0.2,
                friction: 100
            }, this.scene);
    } 

    public applyMovement(unit_direction: BABYLON.Vector3, force: number){
        let contactPoint: BABYLON.Vector3 = this.playerMesh.absolutePosition.clone();
        contactPoint.y += 20;

        let direction: BABYLON.Vector3 = unit_direction.multiplyByFloats(force, force, force);
        this.playerMesh.applyImpulse(direction, contactPoint);
    }
}