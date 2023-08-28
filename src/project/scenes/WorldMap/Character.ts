import { Container, Graphics, Point } from "pixi.js";
import type { Terrain } from "./Terrain";

export class Character extends Container {
	public static MOVESPEED: number = 177 / 2;
	private playerPositionX: number;
	private playerPositionY: number;
	private player: Graphics;
	public terrainUnderCharacter: Terrain; // Guarda el terreno actual bajo el personaje
	public tileX: number;
	public tileY: number;

	constructor(initialPosX: number, initialPosY: number) {
		super();
		this.player = new Graphics();
		this.player.beginFill();
		this.player.drawRect(0, 0, 177, 177);
		this.player.endFill();

		this.playerPositionX = initialPosX;
		this.playerPositionY = initialPosY;
		this.terrainUnderCharacter = null; // Inicialmente no hay terreno bajo el personaje

		this.tileX = 0;
		this.tileY = 0;

		this.addChild(this.player);
	}
	public setTerrainUnderCharacter(terrain: Terrain): void {
		this.terrainUnderCharacter = terrain;
	}

	public getPlayerPosition(): Point {
		return new Point(this.playerPositionX, this.playerPositionY);
	}

	public moveUp(): void {
		if (this.terrainUnderCharacter) {
			this.playerPositionY -= this.terrainUnderCharacter.getMovementCost() * Character.MOVESPEED;
			this.tileY -= 1;
		} else {
			this.playerPositionY -= Character.MOVESPEED;
			this.tileY -= 1;
		}
		this.updatePlayerPosition();
	}

	public moveDown(): void {
		if (this.terrainUnderCharacter) {
			this.playerPositionY += this.terrainUnderCharacter.getMovementCost() * Character.MOVESPEED;
			this.tileY += 1;
		} else {
			this.playerPositionY += Character.MOVESPEED;
			this.tileY += 1;
		}
		this.updatePlayerPosition();
	}

	public moveLeft(): void {
		if (this.terrainUnderCharacter) {
			this.playerPositionX -= this.terrainUnderCharacter.getMovementCost() * Character.MOVESPEED;
			this.tileX -= 1;
		} else {
			this.playerPositionX -= Character.MOVESPEED;
			this.tileX -= 1;
		}
		this.updatePlayerPosition();
	}

	public moveRight(): void {
		if (this.terrainUnderCharacter) {
			this.playerPositionX += this.terrainUnderCharacter.getMovementCost() * Character.MOVESPEED;
			this.tileX += 1;
		} else {
			this.playerPositionX += Character.MOVESPEED;
			this.tileX += 1;
		}
		this.updatePlayerPosition();
	}
	public updatePlayerPosition(): void {
		// Actualiza la posición del sprite del jugador
		this.player.x = this.playerPositionX;
		this.player.y = this.playerPositionY;
		this.position.set(this.playerPositionX, this.playerPositionY);
		console.log(this.tileX, this.tileY);
	}
}
