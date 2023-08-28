/* eslint-disable @typescript-eslint/naming-convention */
import { Container, Sprite } from "pixi.js";
import Random from "../../../engine/random/Random";
import { PixiScene } from "../../../engine/scenemanager/scenes/PixiScene";
import { Terrain } from "./Terrain";
import { GRASS_TEXTURE, HILL_TEXTURE, RIVER_TEXTURE } from "../../../utils/constants";
import { Character } from "./Character";
import { Keyboard } from "../../../engine/input/Keyboard";
import { InputHandler } from "../../../utils/InputHandler";

export class RandomWorldMap extends PixiScene {
	private WIDTH: number = 10;
	private HEIGHT: number = 15;
	private tiles_: Terrain[][] = []; // Define the tiles array.

	private grassTerrain_: Terrain = new Terrain(1, false, GRASS_TEXTURE);
	private hillTerrain_: Terrain = new Terrain(2, false, HILL_TEXTURE);
	private riverTerrain_: Terrain = new Terrain(3, true, RIVER_TEXTURE);

	private inputHandler: InputHandler;
	private player: Character;

	constructor() {
		super();

		// Initialize the tiles array.
		for (let x = 0; x < this.WIDTH; x++) {
			this.tiles_[x] = [];
			for (let y = 0; y < this.HEIGHT; y++) {
				// Sprinkle some hills.
				if (Random.shared.randomInt(0, 6) === 3) {
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

		const terrainContainer = new Container();
		this.addChild(terrainContainer);

		// Create terrain sprites and add them to the container.
		for (let x = 0; x < this.WIDTH; x++) {
			for (let y = 0; y < this.HEIGHT; y++) {
				const terrain = this.tiles_[x][y];
				const terrainSprite = new Sprite(terrain.getTexture());
				terrainSprite.width = terrain.getTexture().width;
				terrainSprite.height = terrain.getTexture().height;
				terrainSprite.x = x * terrainSprite.width; // Adjust position based on tile size.
				terrainSprite.y = y * terrainSprite.height;
				terrainContainer.addChild(terrainSprite);
			}
		}
		this.player = new Character(0, 0);
		this.addChild(this.player);

		this.inputHandler = new InputHandler(this.player);
		// Antes de mover al personaje, establece el terreno actual bajo él
		const initialTerrain = this.getTile(this.player.x, this.player.y);
		console.log("initialTerrain", initialTerrain.getMovementCost());
		this.player.setTerrainUnderCharacter(initialTerrain);
		console.log("this.player.setTerrainUnderCharacter(initialTerrain)", this.player.setTerrainUnderCharacter(initialTerrain));
	}

	public override update(): void {
		if (Keyboard.shared.justPressed("KeyW")) {
			this.inputHandler.buttonUp.execute();
		}
		if (Keyboard.shared.justPressed("KeyS")) {
			this.inputHandler.buttonDown.execute();
		}
		if (Keyboard.shared.justPressed("KeyA")) {
			this.inputHandler.buttonLeft.execute();
		}
		if (Keyboard.shared.justPressed("KeyD")) {
			this.inputHandler.buttonRight.execute();
		}

		const tile = this.getTile(this.player.tileX, this.player.tileY);
		if (tile) {
			console.log("tile", tile.getMovementCost());
		}
	}

	public getTile(x: number, y: number): any {
		// Verifica si las coordenadas están dentro de los límites
		if (x >= 0 && x < this.WIDTH && y >= 0 && y < this.HEIGHT) {
			return this.tiles_[x][y];
		} else {
			// Devuelve un valor predeterminado o maneja el error de alguna otra manera
			return null; // o lanza una excepción, según tu lógica
		}
	}
}
