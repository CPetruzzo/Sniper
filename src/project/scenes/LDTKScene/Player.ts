import { Sprite } from "pixi.js";
import { Keyboard } from "../../../engine/input/Keyboard";
import { PhysicsContainer } from "../../../utils/PhysicsContainer";

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

	constructor(data: PlayerData) {
		super();
		this.data = data;

		const playerImg = Sprite.from("./img/cheers1.png");
		playerImg.scale.set(0.1);
		// playerImg.position.set(data.pivotX, data.pivotY)
		playerImg.anchor.set(0.5);
		this.addChild(playerImg);
	}


	public playerUpdate(): void {
		this.handleMovement();
	}

	private handleMovement(): void {
		const speed = 10;

		// Reiniciar velocidad
		this.speed.x = 0;
		this.speed.y = 0;

		// Moverse a la izquierda
		if (Keyboard.shared.isDown("KeyA")) {
			this.speed.x = -speed;
			console.log('this.speed.x', this.speed.x)
		}
		// Moverse hacia abajo
		if (Keyboard.shared.isDown("KeyS")) {
			this.speed.y = speed;
			console.log('this.speed.y', this.speed.y)
		}
		// Moverse hacia arriba
		if (Keyboard.shared.isDown("KeyW")) {
			this.speed.y = -speed;
			console.log('this.speed.y', this.speed.y)
		}
		// Moverse a la derecha
		if (Keyboard.shared.isDown("KeyD")) {
			this.speed.x = speed;
			console.log('this.speed.x', this.speed.x)
		}
	}
}



// console.log("Player Identifier:", player.getIdentifier());
// console.log("Player Width:", player.getWidth());
// console.log("Player Height:", player.getHeight());
// console.log("Player Color:", player.getColor());
