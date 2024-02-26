import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import type { BaseTexture } from "@pixi/core";
import { Rectangle, Texture } from "@pixi/core";
import { GetTileTexture } from "./Tileset";
import { encontrarIndice } from "./EntityType";

export class Map extends Container {
	public identifier: string;
	public iid: string;
	public worldX: number;
	public worldY: number;
	public bgColor: string;
	public layerInstances: any;
	public jsonData: any;
	private tiles: Array<Sprite> = [];
	public levels: any;
	public entitiesNames: string[] = [];
	public collisions: any[] = [];
	constructor(jsonData: any, lvlNmbr: number) {
		super();

		this.identifier = jsonData.levels[lvlNmbr].identifier;
		this.iid = jsonData.levels[lvlNmbr].iid;
		this.worldX = jsonData.levels[lvlNmbr].worldX;
		this.worldY = jsonData.levels[lvlNmbr].worldY;
		this.bgColor = jsonData.levels[lvlNmbr].__bgColor;
		this.levels = jsonData.levels;
		this.layerInstances = jsonData.levels[lvlNmbr].layerInstances;
		this.jsonData = jsonData;
	}

	public cutTileset(baseTexture: BaseTexture): void {
		const numTilesX = Math.floor(baseTexture.width / 16);
		const numTilesY = Math.floor(baseTexture.height / 16);

		for (let y = 0; y < numTilesY; y++) {
			for (let x = 0; x < numTilesX; x++) {
				const tile = Sprite.from(new Texture(baseTexture, new Rectangle(x * 16, y * 16, 16, 16)));
				tile.x = x * 16;
				tile.y = y * 16;
				this.addChild(tile);
				this.tiles.push(tile);
			}
		}
	}

	public makeMap(baseTexture: BaseTexture, tilesize: number, levelNmbr: number): void {
		const tileSize = tilesize;
		const level = this.levels[levelNmbr];

		if (!level) {
			console.error(`No se encontró el nivel ${levelNmbr}`);
			return;
		}

		const capasEnOrden = [
			'Default_floor',
			'Custom_floor',
			'Collisions',
			'Wall_tops',
			// 'Entities'
		];

		for (const capaId of capasEnOrden) {
			const layer = level.layerInstances.find((layer: { __identifier: string; }) => layer.__identifier === capaId);
			if (layer) {
				if (layer.__identifier === "Wall_tops") {
					for (const autoLayerTile of layer.autoLayerTiles) {
						const tileTexture = GetTileTexture(
							baseTexture,
							autoLayerTile.src[0],
							autoLayerTile.src[1],
							tileSize,
							tileSize
						);

						const tile = Sprite.from(tileTexture);
						tile.x = autoLayerTile.px[0];
						tile.y = autoLayerTile.px[1] - 16;
						this.addChild(tile);
					}
				} else {
					for (const autoLayerTile of layer.autoLayerTiles) {
						const tileTexture = GetTileTexture(
							baseTexture,
							autoLayerTile.src[0],
							autoLayerTile.src[1],
							tileSize,
							tileSize
						);

						const tile = Sprite.from(tileTexture);
						tile.x = autoLayerTile.px[0];
						tile.y = autoLayerTile.px[1];
						this.addChild(tile);
					}
				}
			}
		}

		const collisionLayer = level.layerInstances.find((layer: { __identifier: string; }) => layer.__identifier === 'Collisions');

		const entitiesLayer = level.layerInstances.find((layer: { __identifier: string; }) => layer.__identifier === 'Entities');
		entitiesLayer.entityInstances.forEach((element: any) => {
			this.entitiesNames.push(element.__identifier);
		});
		const player = entitiesLayer.entityInstances[encontrarIndice(this.entitiesNames, "Player")];
		console.log(player);

		if (collisionLayer) {
			for (const autoLayerTile of collisionLayer.autoLayerTiles) {
				const tileTexture = GetTileTexture(
					baseTexture,
					autoLayerTile.src[0],
					autoLayerTile.src[1],
					tileSize,
					tileSize
				);
				const tile = Sprite.from(tileTexture);
				tile.tint = 0x0ffff;
				tile.name = "collision";
				tile.x = autoLayerTile.px[0];
				tile.y = autoLayerTile.px[1];
				this.collisions.push(tile);
				// console.log('this.collisions', this.collisions);
			}
		}
	}
}
