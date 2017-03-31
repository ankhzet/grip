
import * as DataStore from 'nedb';
import { DB } from './db/db';
import { ObjectUtils } from './utils/object';

export class GearboxDB extends DB {

	constructor() {
		super();
		this.scheme('plugins', (blueprint) => {
			blueprint.index({ fieldName: 'uid', unique: true });
		});
	}

	get plugins(): DataStore {
		return this.tables['plugins'];
	}

}

export class Model {
	uid: string;
}

export class Package<M extends Model> {
	[uid: string]: M;
}

export interface SyncResult {
	request: string[];
	updated: string[];
	removed: string[];
}

export class ModelStore {
	table: DataStore;

	constructor(table: DataStore) {
		this.table = table;
	}

	findModels(uids: string[] = null): Promise<Model[]> {
		return new Promise((resolve, reject) => {
			this.table.find(uids ? {uid: {$in: uids}} : {}, (error, data) => {
				if (error)
					return reject(error);

				resolve(data);
			})
		});
	}

	syncModels(data: Package<Model>, upsert: boolean = true): Promise<SyncResult> {
		let uids = Object.keys(data);
		let del  = uids.filter((uid) => !data[uid]);
		let upd  = uids.filter((uid) => del.indexOf(uid) < 0);

		let all = [];

		if (del.length)
			all.push(
				this.removeModels(del)
			);

		if (upd.length)
			all.push(
				this.updateModels(ObjectUtils.extract(data, upd), upsert)
			);

		let result = {
			request: uids,
			updated: upd,
			removed: del,
		};

		return all.length
			? Promise.all(all).then((uidss: string[][]) => result)
			: Promise.resolve(result);
	}

	updateModels(data: Package<Model>, upsert: boolean = true): Promise<string[]> {
		let uids = Object.keys(data);
		let all = [];
		for (let uid of uids)
			((uid) => {
				all.push(new Promise((resolve, reject) => {
					this.table.update({ uid }, { $set: data[uid] }, { upsert }, (error) => {
						if (error)
							return reject(error);

						return resolve(uid);
					});
				}));
			})(uid);

		return Promise.all(all);
	}

	removeModels(uids: string[]): Promise<string[]> {
		return new Promise((resolve, reject) => {
			this.table.remove({ uid: { $in: uids } }, { multi: true }, (error) => {
				if (error)
					return reject(error);

				return resolve(uids);
			});
		});
	}

}


// (GearBox) => {
//
// 	return class Plugin extends GearBox.Plugin {
//
// 		constructor(...args) {
// 			super(...args);
//
// 			this.on('ACTION', (event, context) => {
// 				context.execute(this, function (sandbox) {
// 					sandbox.unmount();
//
// 					class Finder {
//
// 						constructor(document) {
// 							this.document = document;
// 						}
//
// 						find(search) {
// 							let walker = (node) => {
// 								if (!node.innerText) {
// 									if (node.textContent && (node.textContent.indexOf(search) >= 0))
// 										return node;
//
// 									return false;
// 								}
//
// 								if (node.innerText.indexOf(search) < 0)
// 									return false;
//
// 								for (let child, i = 0; i < node.childNodes.length; i++)
// 									if (child = walker(node.childNodes[i]))
// 										return child;
//
// 								return node;
// 							};
//
// 							return walker(this.document.getElementsByTagName('BODY')[0]);
// 						}
//
// 						show(search) {
// 							let found = this.find(search);
// 							let parent = found.parentElement;
// 							let substitution = this.document.createElement('SPAN');
// 							substitution.innerHTML = found.textContent.replace(search, `<span style="background-color: red; color: white;">${search}</span>`);
//
// 							parent.replaceChild(substitution, found);
//
// 							substitution.scrollIntoView();
// 						}
//
// 					}
//
// 					(new Finder(sandbox.dom)).show('#');
// 				});
// 			});
// 		}

// 	}
//
// }
