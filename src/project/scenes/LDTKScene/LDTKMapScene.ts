import { Container } from "pixi.js";
import { PixiScene } from "../../../engine/scenemanager/scenes/PixiScene";
import { LevelCreator } from "../../../utils/LevelCreator";
import { levelData } from "../../../utils/LevelData";
import { ScaleHelper } from "../../../engine/utils/ScaleHelper";
import { CURRENT_LEVEL, LEVEL_SCALE } from "../../../utils/constants";
import { encontrarIndice } from "../../../utils/EntityType";
import { Player } from "./Player";

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
			if (playerIndex !== -1) {
				const player: Player = this.level.levelEntities.entities[playerIndex];
				player.playerUpdate(dt);

				// Obtener las colisiones detectadas
				const collisions = this.level.mapa.collisions;

				// Verificar si hay colisión y detener el movimiento si es necesario
				if (player.detectCollision(collisions)) {
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