
interface Mountable {
	uid: string;

}

export interface MountedInstance {
	mount(context: any);
	unmount(context: any);
}

export interface MountPoint<I extends MountedInstance> {

	instance(uid: string): I;
	mount(context: any, plugin: Mountable): I;
	unmount(context: any, plugin: Mountable);

}

export type MountCallback<T extends Mountable, I> = (context: any, meta: T) => I;

export class BaseMountPoint<T extends Mountable, I extends MountedInstance> implements MountPoint<I> {
	private callback: MountCallback<T, I>;
	mounted: {[uid: string]: I} = {};

	constructor(callback: MountCallback<T, I>) {
		this.callback = callback;
	}

	instance(uid: string): I {
		return this.mounted[uid];
	}

	mount(context: any, mountable: T): I {
		let instance = this.instance(mountable.uid);
		if (instance && !this.unmount(context, mountable))
			return;

		this.mounted[mountable.uid] = instance = this.callback(context, mountable);

		instance.mount(context);

		return instance;
	}

	unmount(context: any, mountable: T) {
		let instance = this.instance(mountable.uid);
		if (!instance)
			return true;

		instance.unmount(context);

		this.mounted[mountable.uid] = null;
		return true;
	}

}
