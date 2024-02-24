import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import type { BaseTexture } from "@pixi/core";
import { Rectangle, Texture } from "@pixi/core";
import { GetTileTexture } from "./Tileset";

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
		for (let l = 0; l < this.levels.length; l++) {
			for (let i = 0; i < this.layerInstances[l].autoLayerTiles.length; i++) {
				const tileTexture = GetTileTexture(
					baseTexture,
					this.levels[levelNmbr].layerInstances[l].autoLayerTiles[i].src[0],
					this.levels[levelNmbr].layerInstances[l].autoLayerTiles[i].src[1],
					tileSize,
					tileSize
				);

				const tile = Sprite.from(tileTexture);
				tile.x = this.levels[levelNmbr].layerInstances[l].autoLayerTiles[i].px[0];
				tile.y = this.levels[levelNmbr].layerInstances[l].autoLayerTiles[i].px[1];
				this.addChild(tile);
			}
		}
	}
}
