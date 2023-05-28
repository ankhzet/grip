
export interface MatcherInterface<S, R> {
	match(content: S): R|boolean;
}
