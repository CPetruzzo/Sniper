import { Container } from "@pixi/display";
import { EntitiesCreator } from "./EntitiesCreator";
import { Map } from "./TileMap";
import { BaseTexture } from "@pixi/core";

export class LevelCreator extends Container {
	public static readonly BUNDLES = ["img"];

	public levelEntities: EntitiesCreator;

	public readonly mapa: Map;

	constructor(jsonData: any, level: number) {
		super();
		this.mapa = jsonData;

		// console.log(this.mapa.levels[0].layerInstances[1].autoLayerTiles)

		const mapa = new Map(this.mapa, level);
		mapa.makeMap(BaseTexture.from("./img/TopDown_by_deepnight.png"), 16, level);
		mapa.pivot.set(mapa.width / 2, mapa.height / 2);
		this.levelEntities = new EntitiesCreator(jsonData);
		// console.log('this.levelEntities.entities', this.levelEntities.entities)
		this.addChild(this.levelEntities, mapa);

	}

	// // Métodos para acceder a los campos
	// public getIdentifier(): string {
	// 	return this.mapa.identifier;
	// }

	// public getWidth(): number {
	// 	return this.mapa.width;
	// }

	// public getHeight(): number {
	// 	return this.mapa.height;
	// }

	// public getColor(): string {
	// 	return this.mapa.color;
	// }


}
