import { Engine, NullEngine, Scene, Vector3, OimoJSPlugin, ArcRotateCamera } from 'babylonjs';
import { Area } from './objects/area';
import { Player } from './objects/player';
import { Router } from './router';
import { players, PlayerState } from './state';

import { CONFIG } from './../config';


export class World {
    private engine: Engine;
    private scene: Scene;
    private area: Area;
    private playerObjs: { [id: string]: Player } = {};


    constructor() {
        this.engine = new NullEngine();
        this.scene = new Scene(this.engine);
        this.area = new Area(this.scene);
    }

    public init() {
        // Not sure why a camera is needed on the server side...
        var camera = new ArcRotateCamera("Camera", 0, 0.8, 100, Vector3.Zero(), this.scene);

        // Important to first enable physics before creating any mesh
        const OIMO = require("oimo");
        this.scene.enablePhysics(new Vector3(0, -20, 0), new OimoJSPlugin(undefined, OIMO));

        // Creat mesh objects
        this.area.init();

        this.scene.executeWhenReady(() => {
            this.engine.runRenderLoop(() => {
                this.scene.render();
            });

            // Update to clients in fixed interval
            setInterval(() => {
                Object.keys(this.playerObjs).forEach((key) => {
                    let lv = this.playerObjs[key].playerMesh.physicsImpostor.getLinearVelocity();
                    let av = this.playerObjs[key].playerMesh.physicsImpostor.getAngularVelocity();
                    let pos = this.playerObjs[key].playerMesh.position;
                    players[key].angularVelocity = av;
                    players[key].linearVelocity = lv;
                    players[key].position = pos;
                });
                Router.updateWorld();
            }, (1000 / CONFIG.server_update_rate));
        });
    }

    public applyMovment(key: string, data: any) {
        let dir: Vector3 = this.createVector(data.direction);
        let force: number = data.force;

        this.playerObjs[key].applyMovement(dir, force);
    }

    public createPlayer(id: string, name: string): void {
        let player = new Player(this.scene);
        player.init(id);

        // Add player to world 
        this.playerObjs[id] = player;

        // Add player to the global state
        let playerState = new PlayerState();
        playerState.linearVelocity = player.playerMesh.physicsImpostor.getLinearVelocity();
        playerState.angularVelocity = player.playerMesh.physicsImpostor.getAngularVelocity();
        playerState.name = name;
        playerState.uuid = id;
        playerState.position = player.playerMesh.position;

        players[id] = playerState;
    }

    public removePlayer(id: string) {
        let ps: PlayerState = players[id];
        delete players[id];

        let player: Player = this.playerObjs[id];
        if (player !== undefined)
            player.playerMesh.dispose();
        delete this.playerObjs[id];
    }

    private createVector(config: any): Vector3 {
        let vec = new Vector3(
            config.x, config.y, config.z
        );
        return vec;
    }
}