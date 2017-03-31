
import { Plugin } from './plugin';

interface PluginExecutionContext {

}

class PluginExecutor {

	execute(plugin: Plugin, context: PluginExecutionContext) {

	}

}

class Injector extends PluginExecutor {

	execute(plugin: Plugin, context: PluginExecutionContext) {
		chrome.tabs.executeScript({
			code: plugin.code,
		});
	}

}
