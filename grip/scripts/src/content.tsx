
import { Injector } from './core/client/Injector';
import { GripConnector } from './Grip/Server/ServerConnector';

((injector) => {
	injector.log('Injecting...');
})(new Injector(new GripConnector()));
