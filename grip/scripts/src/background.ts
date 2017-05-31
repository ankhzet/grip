
import { Grip } from './Grip/Grip';
import { Nyan } from './core/probe/probe';

((sandbox) => {

	console.log('Grip sandbox:', sandbox);

	(<any>window).Nyan = Nyan;
	(<any>window).Grip = sandbox;

})(new Grip());

