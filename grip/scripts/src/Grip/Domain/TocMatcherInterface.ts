
import { TocInterface } from './TocInterface';

export interface TocMatcherInterface {
	match(content: string): TocInterface;
}
