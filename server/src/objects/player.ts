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
                friction: 100,
                restitution: 0.35
            }, this.scene);
    }

    private isOnGround(): boolean {
        let isOnGround: boolean = false;

        let minY = this.playerMesh.getBoundingInfo().minimum.y + this.playerMesh.position.y;
        let pos = this.playerMesh.absolutePosition.clone();
        pos.y = minY;

        var ray: BABYLON.Ray = new BABYLON.Ray(this.playerMesh.absolutePosition, new BABYLON.Vector3(0, -1, 0));

        let counter: number = 0;
        let info = this.scene.pickWithRay(ray, (mesh) => {
            return !(mesh === this.playerMesh);
        });

        if (info.hit) {
            let pickedY = info.pickedPoint.y;
            isOnGround = (pickedY + 0.15) >= minY;
        }

        return isOnGround;
    }
 
    public applyMovement(unit_direction: BABYLON.Vector3, force: number) {
        let contactPoint: BABYLON.Vector3 = this.playerMesh.absolutePosition.clone();
        contactPoint.y += 20;
        if (unit_direction.y === 1) {
            // Jump
            if(this.isOnGround()){
                let direction: BABYLON.Vector3 = unit_direction.multiplyByFloats(force, force, force);
                this.playerMesh.applyImpulse(direction, contactPoint);
            }
        }
        else {
            let direction: BABYLON.Vector3 = unit_direction.multiplyByFloats(force, force, force);
            this.playerMesh.applyImpulse(direction, contactPoint);
        }
    }
}