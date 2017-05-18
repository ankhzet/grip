
export class Matcher<M, C> {
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

	public instance(context: C): M {
		if (!this._compiled) {
			this._compiled = eval(this.code);
		}

		return this._compiled ? this._compiled(context) : false;
	}
}
