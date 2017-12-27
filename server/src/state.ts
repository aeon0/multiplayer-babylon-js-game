// Global Game States
// players are currently the only objects that are mutable in any way
import { Player } from './objects/player';


export let players: { [id: string]: PlayerState} = {};

class MoveableObject{
    uuid: string;
    position: BABYLON.Vector3;
    linearVelocity: BABYLON.Vector3;
    angularVelocity: BABYLON.Vector3;
}

export class PlayerState extends MoveableObject{
    name: string;
} 