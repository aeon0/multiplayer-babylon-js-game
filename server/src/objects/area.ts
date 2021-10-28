import { Scene, Vector3, Mesh, MeshBuilder, PhysicsImpostor } from 'babylonjs';

export class Area{
    private scene: Scene;
    private mesh: Array<Mesh> = [];

    constructor(scene: Scene){
        this.scene = scene;
    }
    
    public init(){ 
        let plane = Mesh.CreateGround("ground1", 460, 460, 2, this.scene);
        this.mesh.push(plane); 

        let centerObj = Mesh.CreateBox("object", 40, this.scene);
        centerObj.position.y = -17;
        this.mesh.push(centerObj);

        let wall_top: Mesh = MeshBuilder.CreateBox("wall_top", {width: 460, height: 20, depth: 20}, this.scene);
        let wall_bottom: Mesh = wall_top.clone("wall_bottom");
        let wall_left: Mesh = wall_top.clone("wall_left");
        let wall_right: Mesh = wall_top.clone("wall_right");
        wall_top.position.z = 230;
        wall_bottom.position.z = -230;
        wall_left.rotate(new Vector3(0, 1, 0), Math.PI / 2)
        wall_left.position.x = 230;
        wall_right.rotate(new Vector3(0, 1, 0), Math.PI / 2);
        wall_right.position.x = -230;
        this.mesh.push(wall_top);
        this.mesh.push(wall_bottom);
        this.mesh.push(wall_left);
        this.mesh.push(wall_right);

        this.mesh.forEach(element => {
            element.physicsImpostor = new PhysicsImpostor(
                element, 
                PhysicsImpostor.BoxImpostor,
                { 
                    mass: 0, 
                    restitution: 0.3,
                    friction: 100
            }, this.scene);
        });
    }
}