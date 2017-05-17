
import { Model } from '../../core/db/data/Model';

export class Book extends Model{
	private _callable?: ((url: string) => boolean);
	private _matcher: string;

	public uid: string;

	public title: string;
	public uri: string;

	public toc?: {[uri: string]: string};

	public serialize() {
		return {
			uid: this.uid,
			title: this.title,
			uri: this.uri,
			toc: this.toc,
			matcher: this.matcher,
		};
	}

	public match(url: string) {
		return this.callable ? this.callable(url) : false;
	}

	public get callable() {
		if ((!this._callable) && this.matcher) {
			this._callable = this.compileMatcher(this.matcher);
		}

		return this._callable;
	}

	public get matcher(): string {
		return this._matcher;
	}

	public set matcher(matcher: string) {
		if (this._matcher !== matcher) {
			this._callable = null;
		}

		this._matcher = matcher;
	}

	protected compileMatcher(matcher) {
		return matcher ? eval(matcher) : false;
	}
}
