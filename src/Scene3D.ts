import { Assets } from "@pixi/assets";
import type { CameraOrbitControl, StandardMaterial } from "pixi3d/pixi7";
import { Light, LightingEnvironment, Model, LightType, Color } from "pixi3d/pixi7";
// import { fancyGroupLog, fancyLog, silencedLog } from "../../../loggers";
import { PixiScene } from "./engine/scenemanager/scenes/PixiScene";
import { cameraControl } from ".";
import { Keyboard } from "./engine/input/Keyboard";
import { Tween } from "tweedle.js";

export class Scene3D extends PixiScene {
	public static readonly BUNDLES = ["3d"];
	private impala: Model;
	private road: Model;
	private hauntedhouse: Model;
	private firstperson: Model;
	public dragon: Model;

	public static handMovementAmplitude = 0.05; // Ajusta la amplitud del movimiento de las manos
	public static handMovementFrequency = 0.005; // Ajusta la frecuencia del movimiento de las manos
	// Configura velocidades para el movimiento de la cámara
	public static cameraMoveSpeed = 0.2;
	public static vehiculeSpeed = 0.4;
	public static cameraRotationSpeed = 0.01;
	public static GRAVITY = 200;
	private cameraControl: CameraOrbitControl;
	private idle: boolean = true;
	public zoomCameraControl: CameraOrbitControl;

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

		// Example of how to use the logger

		// fancyLog("Fancy logs with correct line numbers over there ---->");

		// fancyGroupLog("we also have fancy groups!");
		// fancyLog("Remember to call groupend :P");
		// console.groupEnd();

		// silencedLog("Silenced in the loggers.ts file!");
	}

	public override update(dt: number): void {
		super.update(dt);

		this.firstperson.position.set(this.cameraControl.target.x, this.cameraControl.target.y, this.cameraControl.target.z);
		this.firstperson.rotationQuaternion.setEulerAngles(this.cameraControl.angles.x, this.cameraControl.angles.y, 0);
		this.firstperson.position.y = this.cameraControl.target.y + Math.cos(performance.now() * Scene3D.handMovementFrequency) * Scene3D.handMovementAmplitude;

		// Object.assign(vignette, {
		// 	width: app.renderer.width, height: app.renderer.height
		//   });
		//   for (let eachpocho of pocho) {
		// 	eachpocho.update();

		// 	// This will render the bunnies from back to front.
		// 	eachpocho.zIndex = -eachpocho.distanceFromCamera();
		//   }

		this.dragon.z += Scene3D.vehiculeSpeed * 3;

		if (Keyboard.shared.isDown("KeyW") || Keyboard.shared.isDown("KeyS") || Keyboard.shared.isDown("KeyA") || Keyboard.shared.isDown("KeyD")) {
			const angleYRad = cameraControl.angles.y * (Math.PI / 180); // Convert degrees to radians
			const angleXRad = cameraControl.angles.x * (Math.PI / 180); // Convert degrees to radians
			// playSFX("running", { loop: true, volume: 0.05 })

			const moveZ = Scene3D.cameraMoveSpeed * Math.cos(angleYRad);
			const moveX = Scene3D.cameraMoveSpeed * Math.sin(angleYRad);
			const moveY = Scene3D.cameraMoveSpeed * Math.sin(angleXRad);

			if (Keyboard.shared.isDown("KeyW")) {
				cameraControl.target.z += moveZ; // Mueve el objetivo hacia adelante
				cameraControl.target.x += moveX; // Mueve el objetivo hacia adelante
				cameraControl.target.y -= moveY; // Mueve el objetivo hacia arriba
			}

			if (Keyboard.shared.isDown("KeyS")) {
				cameraControl.target.z -= moveZ; // Mueve el objetivo hacia atrás
				cameraControl.target.x -= moveX; // Mueve el objetivo hacia atrás
				cameraControl.target.y += moveY; // Mueve el objetivo hacia abajo
			}

			if (Keyboard.shared.isDown("KeyA")) {
				cameraControl.target.z -= moveX; // Mueve el objetivo hacia la izquierda
				cameraControl.target.x += moveZ; // Mueve el objetivo hacia la izquierda
			}

			if (Keyboard.shared.isDown("KeyD")) {
				cameraControl.target.z += moveX; // Mueve el objetivo hacia la derecha
				cameraControl.target.x -= moveZ; // Mueve el objetivo hacia la derecha
			}
		} else {
			// stopSFX("running");
		}

		if (Keyboard.shared.isDown("Space")) {
			cameraControl.target.y += Scene3D.cameraMoveSpeed; // Mueve el objetivo hacia la derecha
		}
		if (Keyboard.shared.isDown("Enter")) {
			if (this.idle) {
				this.idle = false;
				// this.firstperson.visible = false;
				// this.rifle.visible = true;
			} else {
				this.idle = true;
				// this.firstperson.visible = true;
				// this.rifle.visible = false;
			}
		}

		if (Keyboard.shared.isDown("ArrowUp")) {
			cameraControl.angles.x -= 2;
		}
		if (Keyboard.shared.isDown("ArrowLeft")) {
			cameraControl.angles.y += 2;
			// myAngle = cameraControl.angles.y += 2
		}
		if (Keyboard.shared.isDown("ArrowRight")) {
			cameraControl.angles.y -= 2;
			// myAngle = cameraControl.angles.y -= 2
		}
		if (Keyboard.shared.isDown("ArrowDown")) {
			cameraControl.angles.x += 2;
		}

		if (Keyboard.shared.isDown("KeyR")) {
			// cameraControl.target.z += Scene3D.vehiculeSpeed; // Mueve el objetivo hacia abajo
			this.impala.z += Scene3D.vehiculeSpeed;
		}
		if (Keyboard.shared.isDown("KeyF")) {
			// cameraControl.target.z -= Scene3D.vehiculeSpeed; // Mueve el objetivo hacia abajo
			this.impala.z -= Scene3D.vehiculeSpeed;
		}

		if (Keyboard.shared.isDown("KeyE")) {
			// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
			this.impala.position.set(this.cameraControl.target.x + 1, this.cameraControl.target.y - 2.7, this.cameraControl.target.z);
			this.impala.rotationQuaternion.setEulerAngles(this.cameraControl.angles.x, this.cameraControl.angles.y, 0);
			this.impala.z += Scene3D.vehiculeSpeed;
		}

		if (Keyboard.shared.justPressed("NumpadSubtract")) {
			new Tween(this.cameraControl).to({ distance: 5 }, 500).start();
			// this.firstperson.visible = false;
		}
		if (Keyboard.shared.justPressed("NumpadAdd")) {
			new Tween(this.cameraControl).to({ distance: 0 }, 500).start();
			// this.firstperson.visible = true;
		}

		if (Keyboard.shared.isDown("KeyV")) {
			const zoomAmount = 0.5; // Ajusta la cantidad de zoom según tus necesidades
			this.zoomCameraControl.distance -= zoomAmount;
			// Asegúrate de que la distancia no sea menor que cero o que no zoom demasiado cerca
			if (this.zoomCameraControl.distance < 0) {
				this.zoomCameraControl.distance = 0;
			}

			// Actualiza la posición y la orientación de la primera persona según la cámara de zoom
			this.firstperson.position.set(this.zoomCameraControl.target.x, this.zoomCameraControl.target.y, this.zoomCameraControl.target.z);
			this.firstperson.rotationQuaternion.setEulerAngles(this.zoomCameraControl.angles.x, this.zoomCameraControl.angles.y, 0);
		}
	}
}
