export class Area{
    private scene: BABYLON.Scene;
    private mesh: Array<BABYLON.Mesh> = [];

    constructor(scene: BABYLON.Scene){
        this.scene = scene;
    }
    
    public init(){ 
        let plane = BABYLON.Mesh.CreateGround("ground1", 460, 460, 2, this.scene);
        this.mesh.push(plane); 

        let centerObj = BABYLON.Mesh.CreateBox("object", 40, this.scene);
        centerObj.position.y = -17;
        this.mesh.push(centerObj);

        let wall_top: BABYLON.Mesh = BABYLON.MeshBuilder.CreateBox("wall_top", {width: 460, height: 20, depth: 20}, this.scene);
        let wall_bottom: BABYLON.Mesh = wall_top.clone("wall_bottom");
        let wall_left: BABYLON.Mesh = wall_top.clone("wall_left");
        let wall_right: BABYLON.Mesh = wall_top.clone("wall_right");
        wall_top.position.z = 230;
        wall_bottom.position.z = -230;
        wall_left.rotate(new BABYLON.Vector3(0, 1, 0), Math.PI / 2)
        wall_left.position.x = 230;
        wall_right.rotate(new BABYLON.Vector3(0, 1, 0), Math.PI / 2);
        wall_right.position.x = -230;
        this.mesh.push(wall_top);
        this.mesh.push(wall_bottom);
        this.mesh.push(wall_left);
        this.mesh.push(wall_right);

        this.mesh.forEach(element => {
            element.physicsImpostor = new BABYLON.PhysicsImpostor(
                element, 
                BABYLON.PhysicsImpostor.BoxImpostor,
                { 
                    mass: 0, 
                    restitution: 0.3,
                    friction: 100
            }, this.scene);
        });
    }
}