import { Assets } from "@pixi/assets";
import type { StandardMaterial } from "pixi3d/pixi7";
import { Light, LightingEnvironment, Model, LightType, Color } from "pixi3d/pixi7";
// import { fancyGroupLog, fancyLog, silencedLog } from "../../../loggers";
import { PixiScene } from "./engine/scenemanager/scenes/PixiScene";
import { cameraControl } from ".";
import { Keyboard } from "./engine/input/Keyboard";

export class Scene3D extends PixiScene {
	public static readonly BUNDLES = ["3d"];
	private impala: Model;
	private road: Model;
	private hauntedhouse: Model;
	private firstperson: Model;

	public static handMovementAmplitude = 0.05; // Ajusta la amplitud del movimiento de las manos
	public static handMovementFrequency = 0.005; // Ajusta la frecuencia del movimiento de las manos
	cameraControl: any;
	// Configura velocidades para el movimiento de la cámara
	public static cameraMoveSpeed = 0.2;
	public static vehiculeSpeed = 0.4;
	public static cameraRotationSpeed = 0.01;
	public static GRAVITY = 200
	
	constructor() {
		super();

		this.impala = Model.from(Assets.get("impala"));
		this.road = Model.from(Assets.get("road"));
		this.hauntedhouse = Model.from(Assets.get("hauntedhouse"));
		this.firstperson = Model.from(Assets.get("firstperson"));

		this.impala.x = 20
		this.impala.y = +1
		this.impala.scale.set(30, 30, 30)
		this.hauntedhouse.x = 50
		this.firstperson.scale.set(0.03, 0.03, 0.03)

		this.addChild(this.impala, this.road, this.hauntedhouse, this.firstperson);
		
		const dirLight = new Light();
		dirLight.type = LightType.directional;
		dirLight.intensity = 1;
		dirLight.color = new Color(1, 1, 1);
		dirLight.rotationQuaternion.setEulerAngles(45, -75, 0);
		LightingEnvironment.main.lights.push(dirLight);

		const dirLight2 = new Light();
		dirLight2.type = LightType.directional;
		dirLight2.intensity = 1;
		dirLight2.color = new Color(1, 1, 1);
		dirLight2.rotationQuaternion.setEulerAngles(45, 75, 0);
		LightingEnvironment.main.lights.push(dirLight2);

		this.cameraControl = cameraControl;

		this.hauntedhouse.animations[0].loop = true;
		this.hauntedhouse.animations[0].play();
		this.hauntedhouse.scale.set(3);
		this.hauntedhouse.meshes.forEach((mesh) => {
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
	
		this.firstperson.position.set(cameraControl.target.x, cameraControl.target.y, cameraControl.target.z)
		this.firstperson.rotationQuaternion.setEulerAngles(cameraControl.angles.x, cameraControl.angles.y, 0)
		this.firstperson.position.y = cameraControl.target.y + Math.cos(performance.now() * Scene3D.handMovementFrequency) * Scene3D.handMovementAmplitude;

		// Object.assign(vignette, {
		// 	width: app.renderer.width, height: app.renderer.height
		//   });
		//   for (let eachpocho of pocho) {
		// 	eachpocho.update();
		
		// 	// This will render the bunnies from back to front.
		// 	eachpocho.zIndex = -eachpocho.distanceFromCamera();
		//   }
				
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
			cameraControl.target.y -= Scene3D.cameraMoveSpeed; // Mueve el objetivo hacia la derecha
		  }
		
		  if (Keyboard.shared.isDown("ArrowUp")) {
			this.firstperson.rotationQuaternion.setEulerAngles(cameraControl.angles.x, cameraControl.angles.y, 0)
		  }
		  if (Keyboard.shared.isDown("ArrowLeft")) {
			cameraControl.angles.y += 2
			// myAngle = cameraControl.angles.y += 2
		  }
		  if (Keyboard.shared.isDown("ArrowRight")) {
			cameraControl.angles.y -= 2
			// myAngle = cameraControl.angles.y -= 2
		  }
		  if (Keyboard.shared.isDown("ArrowDown")) {
			this.firstperson.rotationQuaternion.setEulerAngles(cameraControl.angles.x, cameraControl.angles.y, 0)
		  }
		
		  if (Keyboard.shared.isDown("KeyR")) {
			cameraControl.target.z += Scene3D.vehiculeSpeed; // Mueve el objetivo hacia abajo
			this.impala.z += Scene3D.vehiculeSpeed
		  }
		  if (Keyboard.shared.isDown("KeyF")) {
			cameraControl.target.z -= Scene3D.vehiculeSpeed; // Mueve el objetivo hacia abajo
			this.impala.z -= Scene3D.vehiculeSpeed
		  }
		
		  if (Keyboard.shared.isDown("KeyE")) {
			this.impala.position.set(this.cameraControl.target.x + 1, this.cameraControl.target.y - 2.7, this.cameraControl.target.z)
			this.impala.rotationQuaternion.setEulerAngles(this.cameraControl.angles.x, this.cameraControl.angles.y, 0)
			this.impala.z += Scene3D.vehiculeSpeed
		  }
	}
}
