import { Player } from "../project/scenes/LDTKScene/Player";

export interface EntityType {
	__identifier: string;
	iid?: any;
	px0?: any;
	px1?: any;
	width?: any;
	height?: any;
	__pivot0?: any;
	__pivot1?: any;
	__tile?: any;
	fieldInstances?: any;
	// Define otras propiedades comunes para todas las entidades aquí
}

export function createEntityInstance(data: any): any {
	// Lógica para crear instancias de entidades según el tipo

	switch (data.__identifier) {
		case "Player":
			console.log(`new ${data.__identifier}`);
			return new Player(data);
		case "Door":
			console.log(`new ${data.__identifier}`);
			break;
		case "Button":
			console.log(`new ${data.__identifier}`);
			break;
		case "Item":
			console.log(`new ${data.__identifier}`);
			break;
		case "SecretWall":
			console.log(`new ${data.__identifier}`);
			break;
		// return new Platform(data);
		// case "Rope":
		//     return new Ropes(data);
		// Agrega más casos para otros tipos de entidades aquí
		default:
			console.log(`Tipo de entidad no reconocido: ${data.__identifier}`);
			return null;
	}
}

// Métodos para acceder a los campos
export function getIdentifier(data: any): string {
	return data.__identifier;
}

export function getWidth(data: any): number {
	return data.width;
}

export function getHeight(data: any): number {
	return data.height;
}

export function getColor(data: any): string {
	return data.color;
}