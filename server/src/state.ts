// Global Game States
// players are currently the only objects that are mutable in any way
import { Player } from './objects/player';
import { Vector3 } from 'babylonjs';


export let players: { [id: string]: PlayerState} = {};

class MoveableObject{
    uuid: string;
    position: Vector3;
    linearVelocity: Vector3;
    angularVelocity: Vector3;
}

export class PlayerState extends MoveableObject{
    name: string;
} 