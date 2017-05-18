
import { MatcherInterface } from './MatcherInterface';

export class Matcher<S, R, M extends MatcherInterface<S, R>> implements MatcherInterface<S, R> {
	private _code: string;
	private _compiled: any;

	public get code(): string {
		return this._code;
	}

	public set code(code: string) {
		if (code !== this._code) {
			this._compiled = null;
		}

		this._code = code;
	}

	public instance(context): M {
		if (!this._compiled) {
			this._compiled = eval(this.code);
		}

		return this._compiled ? this._compiled(context) : false;
	}

	match(content: any) {
		let matcher;

		if (matcher = this.instance(this)) {
			return matcher.matc(content);
		}

		return false;
	}

}
