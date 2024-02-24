import { Container } from "pixi.js";
import { PixiScene } from "../../../engine/scenemanager/scenes/PixiScene";
import { LevelCreator } from "../../../utils/LevelCreator";
import { levelData } from "../../../utils/LevelData";
import { ScaleHelper } from "../../../engine/utils/ScaleHelper";
import { CURRENT_LEVEL } from "../../../utils/constants";

export class LDTKMapScene extends PixiScene {
	private world: Container = new Container();
	private level: LevelCreator;
	constructor() {
		super();

		this.addChild(this.world);
		this.level = new LevelCreator(levelData[0], CURRENT_LEVEL);
		this.world.addChild(this.level);
	}

	public override update(_dt: number): void {

		// TODO GET ENTITIES BY NAME => GETPLAYER
		this.level.levelEntities.entities[0].playerUpdate();
		console.log('this.level.levelEntities.entities', this.level.levelEntities.entities)
	}

	public override onResize(_newW: number, _newH: number): void {
		ScaleHelper.setScaleRelativeToIdeal(this.world, _newW * 3, _newH * 3, 1920, 1080, ScaleHelper.FILL);
		this.world.x = _newW * 0.5;
		this.world.y = _newH * 0.5;
	}
}