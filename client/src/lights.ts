export class Lights{
    private light : BABYLON.HemisphericLight;
    private lightDirectional: BABYLON.DirectionalLight;
    private scene: BABYLON.Scene;
    private shadowGenerator: BABYLON.ShadowGenerator = null;

    constructor(scene: BABYLON.Scene){
        this.scene = scene;
    }
    
    public init(useShadowGenerator: boolean = true){
        this.light = new BABYLON.HemisphericLight('lightHs',new BABYLON.Vector3(0.2, 1, 0.2), this.scene); 
        this.light.specular = new BABYLON.Color3(0.1, 0.1, 0.1);
        this.light.intensity = 0.8;

        this.lightDirectional = new BABYLON.DirectionalLight("lightDir", new BABYLON.Vector3(-2, -4, 2), this.scene);    
        this.lightDirectional.diffuse = new BABYLON.Color3(0.2, 0.2, 0.2);	
        this.lightDirectional.specular = new BABYLON.Color3(0, 0, 0);
        this.lightDirectional.position = new BABYLON.Vector3(250, 250, 0);
        this.lightDirectional.intensity = 1.5;

        if(useShadowGenerator){
            this.shadowGenerator = new BABYLON.ShadowGenerator(4192, this.lightDirectional);
        }
    }

    public addShadowCaster(mesh: BABYLON.AbstractMesh){
        this.shadowGenerator.getShadowMap().renderList.push(mesh);
    }
}