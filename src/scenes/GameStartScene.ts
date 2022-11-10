import { Graphics, Sprite } from "pixi.js";
import { Player } from "../games/Player";
import { SceneBase } from "../utils/SceneBase";


export class GameStartScene extends SceneBase {
    playerBardo: Player;

    constructor() {
        super();

        const graph= new Graphics();
        graph.beginFill(0x00FF00, 1);
        graph.drawRect(-(100),-(100),100, 100);
        graph.endFill();
        graph.position.set(500,500);
        this.addChild(graph);

        const BackGround = Sprite.from("B1");
        BackGround.scale.set(2)
        BackGround.position.set(0,50)
        this.addChild(BackGround);

       // UN JUGADOR
       this.playerBardo = new Player();
       this.playerBardo.scale.set(2);
       this.playerBardo.position.set(200,600);
       this.addChild(this.playerBardo);
    }

       // ACTUALIZACION PARA DARLE SU FISICA Y SU MOVIMIENTO
       public update(_deltaFrame: number, deltaTime: number): void {
        this.playerBardo.update(deltaTime); // Actualizacion del personaje
        // this.HPbar.update(deltaTime); // Actualizacion del barra de vida
       }
    
}

