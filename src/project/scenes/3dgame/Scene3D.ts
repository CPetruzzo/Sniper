import { Assets } from "@pixi/assets";
import type { CameraOrbitControl, StandardMaterial } from "pixi3d/pixi7";
import { Light, LightingEnvironment, Model, LightType, Color, Mesh3D } from "pixi3d/pixi7";
import { PixiScene } from "../../../engine/scenemanager/scenes/PixiScene";
import { cameraControl } from "../../..";
import { Keyboard } from "../../../engine/input/Keyboard";
import { Tween } from "tweedle.js";
import { Text, TextStyle } from "pixi.js";

export class Scene3D extends PixiScene {
	public static readonly BUNDLES = ["3d"];
	public static handMovementAmplitude = 0.05;
	public static handMovementFrequency = 0.005;
	public static cameraMoveSpeed = 0.2;
	public static vehiculeSpeed = 0.4;
	public static cameraRotationSpeed = 0.01;
	public static GRAVITY = 200;

	private impala: Model;
	private road: Model;
	private hauntedhouse: Model;
	private firstperson: Model;
	private dragon: Model;
	private cameraControl: CameraOrbitControl;
	public zoomCameraControl: CameraOrbitControl;
	public explanationText: Text = new Text("this is the explanation");
	public onCar: boolean = false;

	constructor() {
		super();

		this.impala = Model.from(Assets.get("impala"));
		this.road = Model.from(Assets.get("road"));
		this.hauntedhouse = Model.from(Assets.get("hauntedhouse"));
		this.firstperson = Model.from(Assets.get("firstperson"));
		this.dragon = Model.from(Assets.get("dragon"));

		this.firstperson.scale.set(0.03, 0.03, 0.03);
		this.firstperson.y = 50;
		this.impala.x = 20;
		this.impala.y = +1;
		this.impala.scale.set(30, 30, 30);
		this.hauntedhouse.x = 50;

		this.addChild(this.impala, this.road, this.hauntedhouse, this.firstperson, this.dragon);

		this.makeDemoText();

		const dirLight = new Light();
		dirLight.type = LightType.directional;
		dirLight.intensity = 5;
		dirLight.color = new Color(1, 1, 1);
		dirLight.rotationQuaternion.setEulerAngles(45, -75, 0);
		LightingEnvironment.main.lights.push(dirLight);

		const dirLight2 = new Light();
		dirLight2.type = LightType.directional;
		dirLight2.intensity = 5;
		dirLight2.color = new Color(1, 1, 1);
		dirLight2.rotationQuaternion.setEulerAngles(45, 75, 0);
		LightingEnvironment.main.lights.push(dirLight2);

		const dirLight3 = new Light();
		dirLight3.type = LightType.directional;
		dirLight3.intensity = 5;
		dirLight3.color = new Color(1, 1, 1);
		dirLight3.rotationQuaternion.setEulerAngles(-80, 0, -45);
		LightingEnvironment.main.lights.push(dirLight3);

		this.cameraControl = cameraControl;
		this.cameraControl.distance = 0;
		(this.cameraControl.target.x = 0), (this.cameraControl.target.y = 2), (this.cameraControl.target.z = 50);
		this.zoomCameraControl = cameraControl;
		this.zoomCameraControl.distance = 0;
		(this.zoomCameraControl.target.x = 0), (this.cameraControl.target.y = 2), (this.cameraControl.target.z = 50);

		this.hauntedhouse.animations[0].loop = true;
		this.hauntedhouse.animations[0].play();
		this.hauntedhouse.scale.set(3);
		this.hauntedhouse.meshes.forEach((mesh) => {
			const mat = mesh.material as StandardMaterial;
			mat.exposure = 1.1;
			mat.roughness = 0.6;
			mat.metallic = 0;
		});

		const shinyKnob = Mesh3D.createCylinder();
		shinyKnob.scale.set(0.01, 0.01, 0.01);
		shinyKnob.position.set(0.1, 0.02, 0);
		this.impala.addChild(shinyKnob);

		new Tween(shinyKnob).to({ alpha: 0.2 }, 500).repeat(Infinity).yoyo(true).start();

		shinyKnob.on("pointertap", () => {
			console.log("knob");
			this.getInCar();
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
		new Tween(this.cameraControl).to({ x: this.impala.x, y: this.impala.y }, 500).start();
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

		this.explanationText = new Text(
			"Use A/S/D/W to move, \nUse ←↕→ or mouse to rotate camera, \nUse +- or mousewheel to zoom in/out camera, \nUse Space to go up, \nUse R/F to move car",
			textStyle
		);
		this.addChild(this.explanationText);
	}

	public override update(dt: number): void {
		super.update(dt);

		this.firstperson.position.set(this.cameraControl.target.x, this.cameraControl.target.y, this.cameraControl.target.z);
		this.firstperson.rotationQuaternion.setEulerAngles(this.cameraControl.angles.x, this.cameraControl.angles.y, 0);
		this.firstperson.position.y = this.cameraControl.target.y + Math.cos(performance.now() * Scene3D.handMovementFrequency) * Scene3D.handMovementAmplitude;
		this.dragon.z += Scene3D.vehiculeSpeed * 3;

		const angleYRad = cameraControl.angles.y * (Math.PI / 180);
		const angleXRad = cameraControl.angles.x * (Math.PI / 180);
		const moveX = Scene3D.cameraMoveSpeed * Math.sin(angleYRad);
		const moveY = Scene3D.cameraMoveSpeed * Math.sin(angleXRad);
		const moveZ = Scene3D.cameraMoveSpeed * Math.cos(angleYRad);
		if (Keyboard.shared.isDown("KeyW") || Keyboard.shared.isDown("KeyS") || Keyboard.shared.isDown("KeyA") || Keyboard.shared.isDown("KeyD")) {
			if (Keyboard.shared.isDown("KeyW")) {
				cameraControl.target.z += moveZ;
				cameraControl.target.x += moveX;
				cameraControl.target.y -= moveY;
			}

			if (Keyboard.shared.isDown("KeyS")) {
				cameraControl.target.z -= moveZ;
				cameraControl.target.x -= moveX;
				cameraControl.target.y += moveY;
			}

			if (Keyboard.shared.isDown("KeyA")) {
				cameraControl.target.z -= moveX;
				cameraControl.target.x += moveZ;
			}

			if (Keyboard.shared.isDown("KeyD")) {
				cameraControl.target.z += moveX;
				cameraControl.target.x -= moveZ;
			}
		}

		if (Keyboard.shared.isDown("Space")) {
			cameraControl.target.y += Scene3D.cameraMoveSpeed;
		}

		if (Keyboard.shared.isDown("ArrowUp")) {
			if (this.onCar) {
				this.impala.rotationQuaternion.setEulerAngles(0, this.cameraControl.angles.y, 0);
			} else {
				this.cameraControl.angles.x -= 2;
			}
		}
		if (Keyboard.shared.isDown("ArrowLeft")) {
			if (this.onCar) {
				this.cameraControl.angles.y += 2;
				this.impala.rotationQuaternion.setEulerAngles(this.cameraControl.angles.x, this.cameraControl.angles.y, 0);
			} else {
				this.cameraControl.angles.y += 2;
			}
		}
		if (Keyboard.shared.isDown("ArrowRight")) {
			if (this.onCar) {
				this.cameraControl.angles.y -= 2;
				this.impala.rotationQuaternion.setEulerAngles(this.cameraControl.angles.x, this.cameraControl.angles.y, 0);
			} else {
				this.cameraControl.angles.y -= 2;
			}
		}
		if (Keyboard.shared.isDown("ArrowDown")) {
			if (this.onCar) {
				this.impala.rotationQuaternion.setEulerAngles(0, this.cameraControl.angles.y, 0);
			} else {
				this.cameraControl.angles.x += 2;
			}
		}

		if (Keyboard.shared.isDown("KeyR")) {
			if (this.onCar) {
				cameraControl.target.z += moveZ;
				cameraControl.target.x += moveX;
				cameraControl.target.y -= moveY;

				this.impala.z += moveZ;
				this.impala.x += moveX;
				this.impala.y -= moveY;
			}
		}
		if (Keyboard.shared.isDown("KeyF")) {
			if (this.onCar) {
				cameraControl.target.z -= moveZ;
				cameraControl.target.x -= moveX;
				cameraControl.target.y += moveY;

				this.impala.z -= moveZ;
				this.impala.x -= moveX;
				this.impala.y += moveY;
			}
		}

		if (Keyboard.shared.isDown("KeyE")) {
			if (!this.onCar) {
				this.onCar = true;
				// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
				this.impala.position.set(this.cameraControl.target.x * Math.sin(angleYRad), this.impala.y, this.cameraControl.target.z * Math.cos(angleYRad));
				this.impala.rotationQuaternion.setEulerAngles(0, this.cameraControl.angles.y, 0);
			} else {
				this.onCar = false;
			}
		}

		if (Keyboard.shared.justPressed("NumpadSubtract")) {
			new Tween(this.cameraControl).to({ distance: 5 }, 500).start();
		}
		if (Keyboard.shared.justPressed("NumpadAdd")) {
			new Tween(this.cameraControl).to({ distance: 0 }, 500).start();
		}

		if (Keyboard.shared.isDown("KeyV")) {
			const zoomAmount = 0.5;
			this.zoomCameraControl.distance -= zoomAmount;
			if (this.zoomCameraControl.distance < 0) {
				this.zoomCameraControl.distance = 0;
			}
			this.firstperson.position.set(this.zoomCameraControl.target.x, this.zoomCameraControl.target.y, this.zoomCameraControl.target.z);
			this.firstperson.rotationQuaternion.setEulerAngles(this.zoomCameraControl.angles.x, this.zoomCameraControl.angles.y, 0);
		}
	}
}
