import { Container } from "@pixi/display";
import { createEntityInstance } from "./EntityType";
import { CURRENT_LEVEL } from "./constants";

export class EntitiesCreator extends Container {
	public entities: Array<any> = [];
	public entityData: any;

	constructor(levelData: any) {
		super();

		for (let i = 0; i < levelData.levels[CURRENT_LEVEL].layerInstances.length; i++) {
			for (let j = 0; j < levelData.levels[CURRENT_LEVEL].layerInstances[i].entityInstances.length; j++) {
				const entityData = levelData.levels[CURRENT_LEVEL].layerInstances[i].entityInstances[j];
				this.entityData = entityData;
				console.log('this.entityData', this.entityData)
				const entity = createEntityInstance(entityData);
				if (entity) {
					entity.position.set(entityData.px[0], entityData.px[1]);
					this.addChild(entity);
					this.entities.push(entity);
					// console.log('entity', entityData)
					// console.log('this.entities', this.entities)
				} else {
					// console.log("no entities here");
				}
			}
		}
	}
}
