import type { Texture } from "pixi.js";

export class Terrain {
	private movementCost: number;
	private isWater: boolean;
	private terrainTexture: Texture;

	constructor(movementCost: number, isWater: boolean, terrainTexture: Texture) {
		this.movementCost = movementCost;
		this.isWater = isWater;
		this.terrainTexture = terrainTexture;
	}

	public getMovementCost(): number {
		return this.movementCost;
	}

	public getIsWater(): boolean {
		return this.isWater;
	}

	public getTexture(): Texture {
		return this.terrainTexture;
	}
}
