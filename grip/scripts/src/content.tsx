
import { Injector } from './core/client/Injector';
import { ServerConnector } from './Grip/Server/ServerConnector';

((injector) => {
	injector.log('Injecting...');
})(new Injector(new ServerConnector()));
