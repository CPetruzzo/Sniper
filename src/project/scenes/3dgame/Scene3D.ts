/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Assets } from "@pixi/assets";
import type { AABB, CameraOrbitControl, StandardMaterial } from "pixi3d/pixi7";
import { Light, LightingEnvironment, Model, LightType, Color, Point3D } from "pixi3d/pixi7";
import { PixiScene } from "../../../engine/scenemanager/scenes/PixiScene";
import { Manager, cameraControl } from "../../..";
import { Keyboard } from "../../../engine/input/Keyboard";
import { Tween } from "tweedle.js";
import { Text, TextStyle, Texture } from "pixi.js";
import { BallGame } from "../BallCollisionGame/BallGame";
import { Loli } from "./Loli";
import Random from "../../../engine/random/Random";

export class Scene3D extends PixiScene {
	public static readonly BUNDLES = ["3d"];
	public static handMovementAmplitude = 0.05;
	public static handMovementFrequency = 0.005;
	public static cameraMoveSpeed = 0.2;
	public static dragonSpeed = 1.2;
	public static vehiculeSpeed = 0.4;
	public static cameraRotationSpeed = 0.01;
	public static GRAVITY = 200;

	private impala: Model;
	private road1: Model;
	private road2: Model;
	private road3: Model;
	private road4: Model;
	private road5: Model;
	private road6: Model;
	private hauntedhouse: Model;
	private firstperson: Model;
	private dragon: Model;
	private cameraControl: CameraOrbitControl;
	public explanationText: Text = new Text("");
	public onCar: boolean = false;
	private colliding: boolean = false;
	public impalaBox: any;
	public dragonBox: any;
	private lolis: Loli[] = [];

	constructor() {
		super();

		this.firstperson = Model.from(Assets.get("firstperson"));
		this.firstperson.name = "firstperson";
		this.impala = Model.from(Assets.get("impala"));
		this.impala.name = "impala";
		this.road1 = Model.from(Assets.get("road"));
		this.road2 = Model.from(Assets.get("road"));
		this.road3 = Model.from(Assets.get("road"));
		this.road4 = Model.from(Assets.get("road"));
		this.road5 = Model.from(Assets.get("road"));
		this.road6 = Model.from(Assets.get("road"));
		this.hauntedhouse = Model.from(Assets.get("hauntedhouse"));
		this.hauntedhouse.name = "hauntedhouse";
		this.dragon = Model.from(Assets.get("dragon"));
		this.dragon.name = "dragon";
		this.firstperson.scale.set(0.03, 0.03, 0.03);
		this.firstperson.y = 50;
		this.impala.x = 60;
		this.impala.y = +1;
		this.impala.scale.set(30, 30, 30);
		this.impala.eventMode = "static";
		this.hauntedhouse.x = 50;

		const roadsize = 234.5;
		this.road2.z = roadsize;
		this.road3.z = roadsize * 2;
		this.road4.z = roadsize * 3;
		this.road5.z = roadsize * 4;
		this.road6.z = roadsize * 5;

		this.addChild(
			this.impala,
			this.road1,
			this.road2,
			this.road3,
			this.road4,
			this.road5,
			this.road6,
			// this.hauntedhouse,
			this.firstperson,
			this.dragon
		);
		this.sortableChildren = true;
		this.hauntedhouse.zIndex = -1;

		// const loli = new Sprite3D(Texture.from("loli"));
		// loli.billboardType = SpriteBillboardType.spherical;
		for (let i = 0; i < 50; i++) {
			const loli = new Loli(Texture.from("loli"), 150, new Point3D(1, 1, 1));
			this.lolis.push(loli);
			this.addChild(loli);
		}

		this.impalaBox = this.impala.getBoundingBox();
		console.log("impalaBox", this.impalaBox);
		this.dragonBox = this.dragon.getBoundingBox();
		console.log("dragonBox", this.dragonBox);

		this.makeDemoText();

		// Crea una luz para simular la linterna (puedes usar point o spot, ajusta según tus necesidades)
		const flashlight = new Light();
		flashlight.type = LightType.spot; // Usamos spot para simular un cono de luz
		flashlight.range = 30; // Rango de alcance de la linterna
		flashlight.color = new Color(1, 1, 0.5); // Color de la luz (amarillo en este ejemplo)
		flashlight.intensity = 100; // Intensidad de la luz (ajusta según lo necesites)

		// Asigna la posición de la linterna para que coincida con la posición de firstperson
		flashlight.position.set(this.firstperson.position.x, this.firstperson.position.y, this.firstperson.position.z);

		// Ajusta la rotación de la linterna según la dirección de firstperson si es necesario
		flashlight.rotationQuaternion.copyFrom(this.firstperson.rotationQuaternion);

		// Agrega la linterna a LightingEnvironment para que afecte a la escena
		LightingEnvironment.main.lights.push(flashlight);

		// light for background
		const dirLight = new Light();
		dirLight.type = LightType.directional;
		dirLight.intensity = 5;
		dirLight.color = new Color(1, 1, 1);
		dirLight.rotationQuaternion.setEulerAngles(45, -75, 0);
		LightingEnvironment.main.lights.push(dirLight);
		const dirLight3 = new Light();
		dirLight3.type = LightType.directional;
		dirLight3.intensity = 5;
		dirLight3.color = new Color(1, 1, 1);
		dirLight3.rotationQuaternion.setEulerAngles(-80, 0, -45);
		LightingEnvironment.main.lights.push(dirLight3);

		this.cameraControl = cameraControl;
		this.cameraControl.distance = 0;
		(this.cameraControl.target.x = 0), (this.cameraControl.target.y = 2), (this.cameraControl.target.z = 50);

		this.hauntedhouse.animations[0].loop = true;
		this.hauntedhouse.animations[0].play();
		this.hauntedhouse.scale.set(3);
		this.hauntedhouse.meshes.forEach((mesh) => {
			const mat = mesh.material as StandardMaterial;
			mat.exposure = 1.1;
			mat.roughness = 0.6;
			mat.metallic = 0;
		});

		this.dragon.z = -500;
		this.dragon.animations[0].loop = true;
		this.dragon.animations[0].play();
		this.dragon.scale.set(15);
		this.dragon.meshes.forEach((mesh) => {
			const mat = mesh.material as StandardMaterial;
			mat.exposure = 1.1;
			mat.roughness = 0.6;
			mat.metallic = 0;
		});
	}

	private getInCar(): void {
		new Tween(this.cameraControl).to({ x: this.impala.x, y: this.impala.y + 10, z: this.impala.z }, 500).start();
	}

	/**
	 * Method to make the text explaining the demo. Nothing to see here.
	 */
	private makeDemoText(): void {
		const textStyle = new TextStyle({
			fill: "white",
			fontFamily: "Arial Rounded MT",
			stroke: "black",
			strokeThickness: 10,
			lineJoin: "round",
		});

		if (this.onCar) {
			this.explanationText = new Text(
				`Use A/S/D/W to move, \nUse ←↕→ or mouse to rotate camera, \nUse +- or mousewheel to zoom in/out camera, \nUse Space to go up \ncamera angle: ${this.cameraControl.angles.x} \nIt's colliding: ${this.colliding}\nIt's onCar: ${this.onCar}`,
				textStyle
			);
			this.addChild(this.explanationText);
		} else {
			this.explanationText = new Text(
				(this.explanationText.text = `Use A/S/D/W to move, \nUse ←↕→ or mouse to rotate camera, \nUse +- or mousewheel to zoom in/out camera, \nUse Space to go up \nIt's colliding: ${this.colliding}\nIt's onCar: ${this.onCar}\nUse E to get in and out of the car`),
				textStyle
			);
			this.addChild(this.explanationText);
		}
	}

	private updateText(): void {
		const movementInstructions = `Use A/S/D/W to move, \nUse ←↕→ or mouse to rotate camera, \nUse +- or mousewheel to zoom in/out camera, \nUse Space to go up`;
		const carInstructions = `camera angle: ${this.cameraControl.angles.x} \nIt's colliding: ${this.colliding}\nIt's onCar: ${this.onCar}`;
		const carControlInstructions = `Use R/F to move car faster`;
		const generalInstructions = `camera angle: ${this.cameraControl.angles.x}\nIt's colliding: ${this.colliding}\nIt's onCar: ${this.onCar}\nUse E to get in and out of the car`;

		this.explanationText.text = this.onCar ? `${movementInstructions}\n${carInstructions}\n${carControlInstructions}` : `${movementInstructions}\n${generalInstructions}`;
	}

	public intersect(a: AABB, b: AABB): boolean {
		return a.min.x <= b.max.x && a.max.x >= b.min.x && a.min.y <= b.max.y && a.max.y >= b.min.y && a.min.z <= b.max.z && a.max.z >= b.min.z;
	}

	public override update(dt: number): void {
		super.update(dt);

		this.lolis.forEach((loli) => {
			const cameraTarget = this.cameraControl.target;
			loli.update();
			loli.moveTowards(cameraTarget, Random.shared.random(0.05, 0.08)); // Puedes ajustar la velocidad según sea necesario
		});
		this.firstperson.position.set(this.cameraControl.target.x, this.cameraControl.target.y, this.cameraControl.target.z);
		this.firstperson.rotationQuaternion.setEulerAngles(this.cameraControl.angles.x, this.cameraControl.angles.y, 0);
		this.firstperson.position.y = this.cameraControl.target.y - 0.2 + Math.cos(performance.now() * Scene3D.handMovementFrequency) * Scene3D.handMovementAmplitude;
		this.dragon.z += Scene3D.dragonSpeed;

		if (this.firstperson.y <= 1) {
			this.colliding = true;
			this.updateText();
		} else {
			this.colliding = false;
			this.updateText();
		}

		const angleYRad = cameraControl.angles.y * (Math.PI / 180);
		const angleXRad = cameraControl.angles.x * (Math.PI / 180);
		const moveCarX = Scene3D.vehiculeSpeed * Math.sin(angleYRad);
		const moveCarY = Scene3D.vehiculeSpeed * Math.sin(angleXRad);
		const moveCarZ = Scene3D.vehiculeSpeed * Math.cos(angleYRad);
		const moveX = Scene3D.vehiculeSpeed * Math.sin(angleYRad);
		const moveY = Scene3D.vehiculeSpeed * Math.sin(angleXRad);
		const moveZ = Scene3D.vehiculeSpeed * Math.cos(angleYRad);
		if (Keyboard.shared.isDown("KeyW") || Keyboard.shared.isDown("KeyS") || Keyboard.shared.isDown("KeyA") || Keyboard.shared.isDown("KeyD")) {
			if (Keyboard.shared.isDown("KeyW")) {
				if (this.onCar) {
					cameraControl.target.z += moveCarZ * 2;
					cameraControl.target.x += moveCarX * 2;
					cameraControl.target.y -= moveCarY * 2;

					this.impala.z += moveCarZ * 2;
					this.impala.x += moveCarX * 2;
					this.impala.y -= moveCarY * 2;
				} else {
					cameraControl.target.z += moveZ;
					cameraControl.target.x += moveX;
					cameraControl.target.y -= moveY;
				}
			}

			if (Keyboard.shared.isDown("KeyS")) {
				if (this.onCar) {
					cameraControl.target.z -= moveCarZ * 2;
					cameraControl.target.x -= moveCarX * 2;
					cameraControl.target.y += moveCarY * 2;

					this.impala.z -= moveCarZ * 2;
					this.impala.x -= moveCarX * 2;
					this.impala.y += moveCarY * 2;
				} else {
					cameraControl.target.z -= moveZ;
					cameraControl.target.x -= moveX;
					cameraControl.target.y += moveY;
				}
			}

			if (Keyboard.shared.isDown("KeyA")) {
				if (!this.onCar) {
					cameraControl.target.z -= moveX;
					cameraControl.target.x += moveZ;
				}
			}

			if (Keyboard.shared.isDown("KeyD")) {
				if (!this.onCar) {
					cameraControl.target.z += moveX;
					cameraControl.target.x -= moveZ;
				}
			}

			if (this.colliding) {
				this.cameraControl.target.y = 1;
			}
		}

		if (Keyboard.shared.isDown("Space")) {
			cameraControl.target.y += Scene3D.cameraMoveSpeed;
		}

		if (Keyboard.shared.isDown("ArrowUp")) {
			if (!this.onCar) {
				this.cameraControl.angles.x -= 2;
			}
		}
		if (Keyboard.shared.isDown("ArrowLeft")) {
			if (this.onCar) {
				if (Keyboard.shared.isDown("KeyW")) {
					this.cameraControl.angles.y += 2;
				}
				if (Keyboard.shared.isDown("KeyS")) {
					this.cameraControl.angles.y -= 2;
				}
				this.impala.rotationQuaternion.setEulerAngles(this.cameraControl.angles.x, this.cameraControl.angles.y, 0);
			} else if (this.onCar) {
			} else {
				this.cameraControl.angles.y += 2;
			}
		}
		if (Keyboard.shared.isDown("ArrowRight")) {
			if (this.onCar) {
				if (Keyboard.shared.isDown("KeyW")) {
					this.cameraControl.angles.y -= 2;
				}
				if (Keyboard.shared.isDown("KeyS")) {
					this.cameraControl.angles.y += 2;
				}
				this.impala.rotationQuaternion.setEulerAngles(this.cameraControl.angles.x, this.cameraControl.angles.y, 0);
			} else if (this.onCar) {
			} else {
				this.cameraControl.angles.y -= 2;
			}
		}
		if (Keyboard.shared.isDown("ArrowDown")) {
			if (!this.onCar) {
				this.cameraControl.angles.x += 2;
			}
		}

		if (Keyboard.shared.isDown("KeyR")) {
			if (this.onCar) {
				cameraControl.target.z += moveZ * 2;
				cameraControl.target.x += moveX * 2;
				cameraControl.target.y -= moveY * 2;

				this.impala.z += moveZ * 2;
				this.impala.x += moveX * 2;
				this.impala.y -= moveY * 2;
			}
		}
		if (Keyboard.shared.isDown("KeyF")) {
			if (this.onCar) {
				cameraControl.target.z -= moveZ * 2;
				cameraControl.target.x -= moveX * 2;
				cameraControl.target.y += moveY * 2;

				this.impala.z -= moveZ * 2;
				this.impala.x -= moveX * 2;
				this.impala.y += moveY * 2;
			}
		}

		if (Keyboard.shared.justPressed("KeyE")) {
			if (!this.onCar) {
				this.onCar = true;
				this.cameraControl.angles.x = 0;
				this.getInCar();
				this.cameraControl.target.y = this.impala.y + 3;
				this.impala.position.set(this.cameraControl.target.x, this.impala.y, this.cameraControl.target.z);
				this.impala.rotationQuaternion.setEulerAngles(this.cameraControl.angles.x, this.cameraControl.angles.y, 0);
			} else {
				this.onCar = false;
			}
			this.updateText();
		}

		if (Keyboard.shared.justPressed("NumpadSubtract")) {
			if (this.onCar) {
				new Tween(this.cameraControl).to({ distance: 25, y: this.cameraControl.target.y + 10 }, 500).start();
			} else {
				new Tween(this.cameraControl).to({ distance: 5 }, 500).start();
			}
		}
		if (Keyboard.shared.justPressed("NumpadAdd")) {
			new Tween(this.cameraControl).to({ distance: 0, y: this.cameraControl.target.y }, 500).start();
		}

		this.impalaBox = this.impala.getBoundingBox();
		this.dragonBox = this.dragon.getBoundingBox();

		const firstpersonBox = this.firstperson.getBoundingBox();
		const collisionfirstperson = this.intersect(firstpersonBox, this.dragonBox);
		if (collisionfirstperson && !this.colliding) {
			this.colliding = true;
			this.updateText();
		}

		const collision = this.intersect(this.dragonBox, this.impalaBox);
		if (collision && !this.colliding) {
			this.colliding = true;
			console.log("this.colliding", this.colliding);
			Manager.changeScene(BallGame);
			this.updateText();
		}
	}
}
