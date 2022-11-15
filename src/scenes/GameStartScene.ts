import { Container, Graphics, Texture, TilingSprite } from "pixi.js";
import { Player } from "../games/Player";
import { SceneBase } from "../utils/SceneBase";
import { SceneManager } from "../utils/SceneManager";


export class GameStartScene extends SceneBase {
    private playerBardo: Player;
    private backgrounds: TilingSprite[];
    private world: Container;

    constructor() {
        super();

        this.world = new Container();

        this.backgrounds = [];

        const graph = new Graphics();
        graph.beginFill(0x00FF00, 1);
        graph.drawRect(-(100), -(100), 100, 100);
        graph.endFill();
        graph.position.set(500, 500);
        this.addChild(graph);

        // FONDOS
        for (let i = 1; i < 6; i++) {
            const background = new TilingSprite(
                Texture.from("B" + i),
                1280,
                720
            );
            this.addChild(background);
            this.backgrounds.push(background);
        }

        // UN JUGADOR
        this.playerBardo = new Player();
        this.playerBardo.scale.set(2);
        this.playerBardo.position.y = 600;
        this.world.addChild(this.playerBardo);

        this.addChild(this.world);

    }

    // ACTUALIZACION PARA DARLE SU FISICA Y SU MOVIMIENTO
    public update(_deltaFrame: number, deltaTime: number): void {
        this.playerBardo.update(deltaTime); // Actualizacion del personaje
        // this.HPbar.update(deltaTime); // Actualizacion del barra de vida

        // PARALLAX
        for (let i = 0; i < this.backgrounds.length; i++) {
            const background = this.backgrounds[i];
            const factor = (i / 6);
            if (this.playerBardo.x < 0) {
                background.tilePosition.x = background.tilePosition.x;
            }
            else {
                background.tilePosition.x -= factor * this.playerBardo.speed.x / 50;
            }
        }

        // LIMITE IZQUIERDO 
        if (this.playerBardo.x < 0) {
            this.playerBardo.x = 0;
            this.world.x = 0;
            this.playerBardo.scale.set(-2, 2);
        }

        // LIMITE INFERIOR
        if (this.playerBardo.y > (SceneManager.HEIGHT - 100)) {
            this.playerBardo.y = (SceneManager.HEIGHT - 100);
            this.playerBardo.canJump = true;
        }


        // CAMARA SEGUÍ A MI PERSONAJE
        (this.world.x = - this.playerBardo.x * this.worldTransform.a + SceneManager.WIDTH / 3)


    }

}

