import { Container, Sprite } from "pixi.js";
import Random from "../../../engine/random/Random";
import { PixiScene } from "../../../engine/scenemanager/scenes/PixiScene";
import { Terrain } from "./Terrain";
import { GRASS_TEXTURE, HILL_TEXTURE, RIVER_TEXTURE } from "../../../utils/constants";

export class RandomWorldMap extends PixiScene{

  private WIDTH: number = 10;
  private HEIGHT: number = 5;
  private tiles_: Terrain[][] = []; // Define the tiles array.

  private grassTerrain_: Terrain = new Terrain(1, false, GRASS_TEXTURE);
  private hillTerrain_: Terrain = new Terrain(3, false, HILL_TEXTURE);
  private riverTerrain_: Terrain = new Terrain(2, true, RIVER_TEXTURE);

  constructor() {
		super();

		// Initialize the tiles array.
		for (let x = 0; x < this.WIDTH; x++) {
			this.tiles_[x] = [];
			for (let y = 0; y < this.HEIGHT; y++) {
				// Sprinkle some hills.
				if (Random.shared.randomInt(0, 3) === 0) {
					this.tiles_[x][y] = this.hillTerrain_;
				} else {
					this.tiles_[x][y] = this.grassTerrain_;
				}
			}
		}

		// Lay a river.
		const x = Random.shared.randomInt(0, this.WIDTH);
		for (let y = 0; y < this.HEIGHT; y++) {
			this.tiles_[x][y] = this.riverTerrain_;
		}
		
		// const cost = this.getTile(0, 0).getMovementCost();
		// console.log('cost', cost)

		const terrainContainer = new Container();
		this.addChild(terrainContainer);

		// Create terrain sprites and add them to the container.
		for (let x = 0; x < this.WIDTH; x++) {
		for (let y = 0; y < this.HEIGHT; y++) {
			const terrain = this.tiles_[x][y];
			const terrainSprite = new Sprite(terrain.getTexture());
			terrainSprite.width = terrainSprite.width / 1.3;
			terrainSprite.height = terrainSprite.height / 1.3;
			terrainSprite.x = x * terrainSprite.width; // Adjust position based on tile size.
			terrainSprite.y = y * terrainSprite.height;
			terrainContainer.addChild(terrainSprite);
		}
		}		
	}

  	public getTile(x: number, y: number) {
		return this.tiles_[x][y];
	}
}


