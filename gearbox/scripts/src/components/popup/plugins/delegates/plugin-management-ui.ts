
import { Plugin } from '../../../../core/plugin';
import { PluginActionsUIDelegate } from './plugin-actions-ui';

export interface PluginManagementUIDelegate<P extends Plugin> extends PluginActionsUIDelegate<P> {
	// listPlugins();
	createPlugin();
	// showPlugin(uid: string): P;
	// editPlugin(uid: string): P;
	savePlugin(uid: string, data);
	removePlugin(uid: string);
}
