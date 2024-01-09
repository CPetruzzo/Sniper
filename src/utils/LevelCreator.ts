import { Container } from "@pixi/display";
import { Platform } from "./Platforms";
import { Sprite } from "@pixi/sprite";
import { Point } from "@pixi/core";
import { GateSwitch } from "./GateSwitch";
import { Gate } from "./Gate";

/**
 * - mapData: formatTiledJSON(json);
 * - set the strings to the Layer Name that is used in Tiled
 */

export class LevelCreator extends Container {
	public platform: Array<Platform> = [];
	public gateSwitches: Array<GateSwitch> = [];
	public gates: Array<Gate> = [];
	public startPoint: Point;
	public endPoint: Point;
	public polyline: Array<any> = [];

	constructor(mapData: any, platforms: string, switches?: string, gates?: string, props?: string, points?: string, polyline?: string) {
		super();

		for (let l = 0; l < mapData.layers.length; l++) {
			for (let p = 0; p < mapData.layers[l].objects.length; p++) {
				switch (mapData.layers[l].name) {
					case props:
						switch (mapData.layers[l].objects[p].name) {
							case "bush":
								const bush = Sprite.from("armanda/bushes.png");
								bush.position.set(mapData.layers[l].objects[p].x, 1080 - mapData.layers[l].objects[p].height);
								this.addChild(bush);
								break;
							case "smallTree":
								const smallTree = Sprite.from("armanda/tree2.png");
								smallTree.position.set(mapData.layers[l].objects[p].x, 1080 - mapData.layers[l].objects[p].height);
								this.addChild(smallTree);
								break;
							case "bigTree":
								const bigTree = Sprite.from("armanda/tree1.png");
								bigTree.position.set(mapData.layers[l].objects[p].x, 1080 - mapData.layers[l].objects[p].height);
								this.addChild(bigTree);
								break;
							case "rock":
								const rock = Sprite.from("armanda/rock.png");
								rock.position.set(mapData.layers[l].objects[p].x, 1080 - mapData.layers[l].objects[p].height);
								this.addChild(rock);
								break;
							default:
								break;
						}

						break;
					case platforms:
						const platform = new Platform(
							mapData.layers[l].objects[p].width,
							mapData.layers[l].objects[p].height,
							mapData.layers[l].objects[p].type,
							mapData.layers[l].objects[p].rotation
						);

						platform.position.set(mapData.layers[l].objects[p].x, mapData.layers[l].objects[p].y - mapData.layers[l].objects[p].height);
						this.addChild(platform);
						platform.name = mapData.layers[l].objects[p].name;
						this.platform.push(platform);
						break;
					case switches:
						// gateSwitch HAVE TO HAS the same name that the door
						const gateSwitch = new GateSwitch();
						gateSwitch.position.set(mapData.layers[l].objects[p].x, mapData.layers[l].objects[p].y - mapData.layers[l].objects[p].height);
						this.addChild(gateSwitch);
						this.gateSwitches.push(gateSwitch);
						break;
					case gates:
						const gate = new Gate(mapData.layers[l].objects[p].name);
						gate.position.set(mapData.layers[l].objects[p].x, mapData.layers[l].objects[p].y - mapData.layers[l].objects[p].height);
						this.addChild(gate);
						this.gates.push(gate);
						break;
					case polyline:
						this.polyline.push(mapData.layers[l].objects[p].polyline);
						break;
					case points:
						switch (mapData.layers[l].objects[p].name) {
							case "start":
								this.startPoint = new Point(mapData.layers[l].objects[p].x, mapData.layers[l].objects[p].y - 150);
								break;
							case "end":
								this.endPoint = new Point(mapData.layers[l].objects[p].x, mapData.layers[l].objects[p].y);
								break;

							default:
								break;
						}

						break;

					default:
						break;
				}
			}
		}
	}
}
