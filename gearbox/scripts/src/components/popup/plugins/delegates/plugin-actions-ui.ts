
import { Plugin } from '../../../../core/plugin';

export interface PluginActionsUIDelegate<P extends Plugin> {
	executePlugin(uid: string);
}
