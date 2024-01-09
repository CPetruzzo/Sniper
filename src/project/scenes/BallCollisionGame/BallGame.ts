// import type { Point } from "pixi.js";
import { Container, Graphics } from "pixi.js";
import { PixiScene } from "../../../engine/scenemanager/scenes/PixiScene";
import { Manager } from "../../..";
import { Keyboard } from "../../../engine/input/Keyboard";
import Random from "../../../engine/random/Random";

export class BallGame extends PixiScene {
	public static readonly BUNDLES: string[] = ["3d"];
	private frameContainer: Container = new Container();
	private frame: Graphics;
	private ball: Graphics;

	private ballSpeedX: number = 10;
	private ballSpeedY: number = 0;
	private gravity: number = 0.2;
	private isShooting: boolean = false;
	public isInAir: boolean = false;
	public isPointerDown: boolean = false; // Nueva variable para rastrear si se mantiene presionado el mouse

	constructor() {
		super();

		this.frameContainer.pivot.set(this.frameContainer.width / 2, this.frameContainer.height / 2);
		this.frameContainer.position.set(Manager.width / 2, Manager.height / 2);
		this.addChild(this.frameContainer);

		this.frame = new Graphics();
		this.frame.beginFill(0x0ff, 1);
		this.frame.drawRect(0, 0, 400, 500);
		this.frame.endFill();
		this.frame.pivot.set(this.frame.width / 2, this.frame.height / 2);
		this.frameContainer.addChild(this.frame);

		this.ball = new Graphics();
		this.ball.beginFill(0x0ffff, 1);
		this.ball.drawCircle(0, 0, 10);
		this.ball.endFill();
		this.ball.pivot.set(this.ball.width / 2, this.ball.height / 2);
		this.ball.position.set(0, this.frame.height / 2);
		this.frameContainer.addChild(this.ball);

		this.frameContainer.interactive = true;
	}

	private shootBall(): void {
		if (!this.isShooting) {
			this.isShooting = true;
			this.isInAir = true; // La pelota está en el aire después de disparar
			this.ballSpeedX = Random.shared.randomInt(-5, 5);
			this.ballSpeedY = Random.shared.randomInt(-15, -20); // Impulso inicial hacia arriba
		}
	}

	/** Lógica de movimiento y rebote de la pelota */
	private updateBall(): void {
		if (this.isShooting) {
			// Aplicar gravedad
			this.ballSpeedY += this.gravity;

			// Actualizar posición de la pelota
			this.ball.position.x += this.ballSpeedX;
			this.ball.position.y += this.ballSpeedY;

			// Detección de colisión con las paredes izquierda y derecha
			if (this.ball.position.x - this.ball.width < -this.frame.width / 2 || this.ball.position.x > this.frame.width / 2) {
				// Invertir la dirección de la pelota al golpear una pared
				this.ballSpeedX *= -1;
			}

			// Detección de colisión con el suelo (rebote)
			if (this.ball.position.y + this.ball.height / 2 > this.frame.height / 2) {
				this.ball.position.y = this.frame.height / 2 - this.ball.height / 2;
				// this.ballSpeedY *= -0.8; // Rebote con pérdida de energía
				this.ballSpeedY = 0;
			}

			// Detección de colisión con el techo (rebote)
			if (this.ball.position.y - this.ball.height / 2 < -this.frame.height / 2) {
				this.ball.position.y = -this.frame.height / 2 + this.ball.height / 2;
				// this.ballSpeedY *= -0.8; // Rebote con pérdida de energía
				this.ballSpeedY *= -1;
			}

			// Detener el disparo cuando la pelota esté en el suelo
			if (this.ball.position.y + this.ball.height / 2 >= this.frame.height / 2 && this.ballSpeedY > -1) {
				this.isShooting = false;
				this.isInAir = false;
				this.ballSpeedY = 0;
			}
		} else {
			// Si la pelota no está disparando, restablécela al punto de inicio
			this.resetBall();
		}
	}

	private resetBall(): void {
		this.ball.position.set(0, this.frame.height / 2);
		this.ballSpeedX = 2;
		this.ballSpeedY = 0;
	}

	public override update(): void {
		if (Keyboard.shared.isDown("KeyW")) {
			this.shootBall();
		}

		this.updateBall();

		// Detener el disparo cuando la pelota esté en el suelo
		if (this.ball.position.y + this.ball.height / 2 >= this.frame.height / 2 && this.ballSpeedY > -1) {
			this.isShooting = false;
			this.isInAir = false;
			this.ballSpeedY = 0;
		}
	}
}
