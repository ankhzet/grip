
import { Injector } from './core/client/Injector';
import { GripServerConnector } from './Grip/Client/GripServerConnector';

((injector) => {
	injector.log('Injecting...');
})(new Injector(new GripServerConnector()));
