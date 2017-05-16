
import { ContainerInterface } from '../db/data/ContainerInterface';
import { Serializer } from './data-server';
import { PackageInterface } from '../db/data/PackageInterface';
import { IdentifiableInterface } from '../db/data/IdentifiableInterface';

export abstract class AbstractPacker<T extends IdentifiableInterface, R> {
	serializers: ContainerInterface<Serializer<T, R>> = {};

	registerSerializer(name: string, serializer: Serializer<T, R>) {
		this.serializers[name] = serializer;
	}

	abstract pack(what: string, data: PackageInterface<T>): R[];
}

