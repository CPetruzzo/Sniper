import { Container } from "pixi.js";
import { PixiScene } from "../../../engine/scenemanager/scenes/PixiScene";
import { LevelCreator } from "../../../utils/LevelCreator";
import { levelData } from "../../../utils/LevelData";
import { ScaleHelper } from "../../../engine/utils/ScaleHelper";
import { CURRENT_LEVEL, LEVEL_SCALE } from "../../../utils/constants";
import { encontrarIndice } from "../../../utils/EntityType";
import type { Player } from "./Player";
import { Item } from "./Item";

export class LDTKMapScene extends PixiScene {
	public static readonly BUNDLES = ["package-1"];

	private world: Container = new Container();
	private level: LevelCreator;
	constructor() {
		super();

		this.addChild(this.world);
		this.level = new LevelCreator(levelData[0], CURRENT_LEVEL);
		this.world.addChild(this.level);
	}

	public override update(dt: number): void {
		if (this.level.levelEntities) {
			const playerIndex = encontrarIndice(this.level.levelEntities.dataName, "Player");
			// const itemIndex = encontrarIndice(this.level.levelEntities.dataName, "Item");

			if (playerIndex !== -1) {
				const player: Player = this.level.levelEntities.entities[playerIndex];
				player.playerUpdate(dt);

				const collisions = this.level.mapa.collisions;

				for (const item of this.level.levelEntities.entities) {
					if (item instanceof Item) {
						switch (item.data.fieldInstances[0].__value) {
							case "Health":
								player.detectCollision([item], true);
								if (player.detectCollision([item])) {
									// lo remuevo, falta hacer algo antes
									// console.log('item.parent', item.parent) // quien es el papa?
									this.level.levelEntities.removeChild(item)
									console.log(`agarre el ${item.data.fieldInstances[0].__value}`)
								}
								break;
							case "KeyA":
								player.detectCollision([item], true);
								if (player.detectCollision([item])) {
									// lo remuevo, falta hacer algo antes
									// console.log('item.parent', item.parent) // quien es el papa?
									this.level.levelEntities.removeChild(item)
									console.log(`agarre el ${item.data.fieldInstances[0].__value}`)
								}
								// Lógica para interactuar con la llave A
								break;
							default:
								// Lógica por defecto para otros tipos de objetos
								break;
						}
					}
				}

				if (player.detectCollision(collisions, false)) {
					player.stopMovement();
				}
			}
		}
	}

	public override onResize(_newW: number, _newH: number): void {
		ScaleHelper.setScaleRelativeToIdeal(this.world, _newW * LEVEL_SCALE, _newH * LEVEL_SCALE, 1920, 1080, ScaleHelper.FILL);
		this.world.x = 0;
		this.world.y = 0;
	}
}
