import { Sprite } from "pixi.js";
import { Keyboard } from "../../../engine/input/Keyboard";
import { PhysicsContainer } from "../../../utils/PhysicsContainer";
import { PLAYER_WALK_SPEED } from "../../../utils/constants";

export interface FieldDef {
	identifier: string;
	doc: any;
	__type: string;
	uid: number;
	type: string;
	isArray: boolean;
	canBeNull: boolean;
	arrayMinLength: any;
	arrayMaxLength: any;
	editorDisplayMode: string;
	editorDisplayScale: number;
	editorDisplayPos: string;
	editorLinkStyle: string;
	editorDisplayColor: any;
	editorAlwaysShow: boolean;
	editorShowInWorld: boolean;
	editorCutLongValues: boolean;
	editorTextSuffix: any;
	editorTextPrefix: any;
	useForSmartColor: boolean;
	exportToToc: boolean;
	searchable: boolean;
	min: number;
	max: number;
	regex: any;
	acceptFileTypes: any;
	defaultOverride: { id: string, params: any[] };
	textLanguageMode: any;
	symmetricalRef: boolean;
	autoChainRef: boolean;
	allowOutOfLevelRef: boolean;
	allowedRefs: string;
	allowedRefsEntityUid: any;
	allowedRefTags: string[];
	tilesetUid: any;
}

export interface PlayerData {
	identifier: string;
	uid: number;
	tags: string[];
	exportToToc: boolean;
	allowOutOfBounds: boolean;
	doc: any;
	width: number;
	height: number;
	resizableX: boolean;
	resizableY: boolean;
	minWidth: any;
	maxWidth: any;
	minHeight: any;
	maxHeight: any;
	keepAspectRatio: boolean;
	tileOpacity: number;
	fillOpacity: number;
	lineOpacity: number;
	hollow: boolean;
	color: string;
	renderMode: string;
	showName: boolean;
	tilesetId: number;
	tileRenderMode: string;
	tileRect: { tilesetUid: number, x: number, y: number, w: number, h: number };
	uiTileRect: any;
	nineSliceBorders: any[];
	maxCount: number;
	limitScope: string;
	limitBehavior: string;
	pivotX: number;
	pivotY: number;
	fieldDefs: FieldDef[];
}

export class Player extends PhysicsContainer {
	public data: PlayerData;
	public playerImg: Sprite;
	constructor(data: PlayerData) {
		super();
		this.data = data;

		this.playerImg = Sprite.from("./img/cheers1.png");
		this.playerImg.scale.set(0.05);
		this.playerImg.anchor.set(0.5);
		this.addChild(this.playerImg);
	}

	public playerUpdate(dt: number): void {
		super.update(dt);
		this.handleMovement();
	}

	private handleMovement(): void {

		// Reiniciar velocidad
		this.speed.x = 0;
		this.speed.y = 0;

		// Moverse a la izquierda
		if (Keyboard.shared.isDown("KeyA")) {
			this.speed.x = -PLAYER_WALK_SPEED;
			// console.log('this.speed.x', this.speed.x)
		}
		// Moverse hacia abajo
		if (Keyboard.shared.isDown("KeyS")) {
			this.speed.y = PLAYER_WALK_SPEED;
			// console.log('this.speed.y', this.speed.y)
		}
		// Moverse hacia arriba
		if (Keyboard.shared.isDown("KeyW")) {
			this.speed.y = -PLAYER_WALK_SPEED;
			// console.log('this.speed.y', this.speed.y)
		}
		// Moverse a la derecha
		if (Keyboard.shared.isDown("KeyD")) {
			this.speed.x = PLAYER_WALK_SPEED;
			// console.log('this.speed.x', this.speed.x)
		}
	}

	public detectCollision(collisions: any[]): boolean {
		let collisionDetected = false;

		for (const collisionSprite of collisions) {
			const collisionBounds = collisionSprite.getBounds();
			const playerBounds = this.playerImg.getBounds();

			if (
				playerBounds.x < collisionBounds.x + collisionBounds.width &&
				playerBounds.x + playerBounds.width > collisionBounds.x &&
				playerBounds.y < collisionBounds.y + collisionBounds.height &&
				playerBounds.y + playerBounds.height > collisionBounds.y
			) {

				// Calcular la dirección de ajuste basándose en la posición relativa del jugador y el objeto de colisión
				const adjustX = playerBounds.x < collisionBounds.x ? -1 : 1;
				const adjustY = playerBounds.y < collisionBounds.y ? -1 : 1;

				// Mover ligeramente al jugador fuera del objeto de colisión
				this.playerImg.x += adjustX * 2;
				this.playerImg.y += adjustY * 2;

				collisionDetected = true;
				break; // Salir del bucle tan pronto como se detecte una colisión
			}
		}

		return collisionDetected;
	}


	public stopMovement(): void {
		// Reiniciar la velocidad del jugador
		this.speed.x = 0;
		this.speed.y = 0;
	}
}
