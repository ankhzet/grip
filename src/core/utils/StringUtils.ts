
export class StringUtils {

	public static camelCaseToHyphenCase(text: string) {
		return text.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();
	}

}
