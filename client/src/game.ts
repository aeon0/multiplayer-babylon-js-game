import { Lights } from './lights';
import { Camera } from './camera';
import { Player } from './player';
import { Enemy } from './enemy';
import { Area } from './area';
import { RouterService } from "./routing/router.service";
import { fsm, Events } from "./controller";


export class Game {
    private canvas: any;
    private engine: BABYLON.Engine;
    private scene: BABYLON.Scene;
    private camera: Camera;
    private lights: Lights;
    private player: Player;
    private area: Area;
    private enemys: { [id: string]: Enemy } = {};

    private ts_lastUpdate: number = null;
    private update_rate: number = null;


    constructor(canvasElement: string) {
        this.canvas = document.getElementById(canvasElement);
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.scene = new BABYLON.Scene(this.engine);

        this.lights = new Lights(this.scene);
        this.camera = new Camera(this.scene);
        this.area = new Area(this.scene);

        RouterService.registerFunction('update', this.updateWorld, this);
        RouterService.registerFunction('remove_player', this.removeEnemy, this);

        window.addEventListener("resize", () => {
            this.engine.resize();
        });
    }

    public load(): void {
        this.scene.clearColor = new BABYLON.Color4(0.09, 0.09, 0.09, 1);
        this.scene.enablePhysics(new BABYLON.Vector3(0, -20, 0), new BABYLON.OimoJSPlugin());

        this.lights.init();
        this.area.init();

        this.scene.executeWhenReady(() => {
            fsm.input(Events.GAME_LOADED);
        });
    }

    public initGameState(): void {
        RouterService.initGameState("default_name", (data) => {
            let playerId = data.playerId;
            let allPlayers = data.players;
            Object.keys(allPlayers).forEach((key) => {
                let linVelo: BABYLON.Vector3 = this.createVector(allPlayers[key].linearVelocity);
                let angVelo: BABYLON.Vector3 = this.createVector(allPlayers[key].angularVelocity);
                let postion: BABYLON.Vector3 = this.createVector(allPlayers[key].position);

                if (key === playerId) {
                    console.log("Create Player");
                    // Creating player
                    this.player = new Player(this.scene, playerId);
                    this.player.init(this.lights);
                    this.player.update(linVelo, angVelo, postion);

                    this.camera.init(this.player.playerMesh);
                }
                else {
                    let enemy = new Enemy(this.scene, key);
                    enemy.init(this.lights);
                    enemy.update(linVelo, angVelo, postion);
                    this.enemys[key] = enemy;
                }
            })

            fsm.input(Events.STATE_INIT_DONE);
        });
    }

    public updateWorld(msg: any) {
        if(this.ts_lastUpdate === null){
            this.ts_lastUpdate = Date.now();
        }
        else{
            let lastUpdate = this.ts_lastUpdate;
            this.ts_lastUpdate = Date.now();
            let diff = this.ts_lastUpdate - lastUpdate;
            let newUpdate = Math.min(Math.floor(1000/diff), 60);
 
            // Otherwise it is quite jumpy and you can't read the numbers
            let updateDiff = Math.abs(newUpdate - this.update_rate);
            if(updateDiff > 4) this.update_rate = newUpdate;

            var updateLabel = document.getElementById("update_label");
            updateLabel.innerHTML = this.update_rate + " update/s";
        }
        Object.keys(msg.players).forEach(key => {
            let config = msg.players[key];
            let linVelo: BABYLON.Vector3 = this.createVector(config.linearVelocity);
            let angVelo: BABYLON.Vector3 = this.createVector(config.angularVelocity);
            let postion: BABYLON.Vector3 = this.createVector(config.position);

            if (key === this.player.id) {
                this.player.update(linVelo, angVelo, postion);
            }
            else {
                let enemy = this.enemys[key];
                if (enemy !== undefined) {
                    enemy.update(linVelo, angVelo, postion);
                }
                else {
                    // New Enemy lets create
                    let enemy = new Enemy(this.scene, key);
                    enemy.init(this.lights);
                    enemy.update(linVelo, angVelo, postion);
                    this.enemys[key] = enemy;
                }
            }
        });
    }

    public removeEnemy(msg: any) {
        let enemy = this.enemys[msg.key];
        if (enemy !== undefined) {
            enemy.playerMesh.dispose();
            delete this.enemys[msg.key];
        }
    }

    public run(): void {
        this.engine.runRenderLoop(() => {
            let deltaTime: number = this.engine.getDeltaTime();

            this.player.applyMovement(this.camera, deltaTime);
            this.camera.followCamera();
            this.scene.render();

            var fpsLabel = document.getElementById("fps_label");
            fpsLabel.innerHTML = this.engine.getFps().toFixed() + " fps";
        });
    }

    private createVector(config: any): BABYLON.Vector3 {
        let vec = new BABYLON.Vector3(
            config.x, config.y, config.z
        );
        return vec;
    }
}

