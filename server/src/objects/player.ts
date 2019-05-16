import { Scene, Vector3, Mesh, PhysicsImpostor } from 'babylonjs';

export class Player {
    private scene: Scene;
    public playerMesh: Mesh;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    public init(name: string) {
        this.playerMesh = Mesh.CreateSphere(name, 12, 4, this.scene);

        this.playerMesh.position.y = 16;
        this.playerMesh.position.x = Math.floor(Math.random() * 30) - 30;
        this.playerMesh.position.z = Math.floor(Math.random() * 30) - 30;

        this.playerMesh.physicsImpostor = new PhysicsImpostor(
            this.playerMesh,
            PhysicsImpostor.SphereImpostor, {
                mass: 0.2,
                friction: 100,
                restitution: 0.35
            }, this.scene);
    }
 
    public applyMovement(unit_direction: Vector3, force: number) {
        let contactPoint: Vector3 = this.playerMesh.absolutePosition.clone();
        contactPoint.y += 20;
        
        let direction: Vector3 = unit_direction.multiplyByFloats(force, force, force);
        this.playerMesh.applyImpulse(direction, contactPoint);
        
    }
}