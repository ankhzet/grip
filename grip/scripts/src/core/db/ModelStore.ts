
import * as DataStore from 'nedb';
import { Model } from './data/Model';
import { ObjectUtils } from '../utils/object';
import { Package } from './data/Package';
import { SyncResultInterface } from './SyncResultInterface';

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

	syncModels(data: Package<Model>, upsert: boolean = true): Promise<SyncResultInterface> {
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
			? Promise.all(all).then((uids: string[][]) => result)
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
			this.table.remove(
				{ uid: { $in: uids } },
				{ multi: true },
				(error) => error ? reject(error) : resolve(uids)
			);
		});
	}

}
