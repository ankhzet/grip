
import { ContainerInterface } from '../db/data/ContainerInterface';
import { PackageInterface } from '../db/data/PackageInterface';
import { IdentifiableInterface } from '../db/data/IdentifiableInterface';
import { Serializer } from '../db/data/Serializer';

export abstract class AbstractPacker<T extends IdentifiableInterface, R> {
	serializers: ContainerInterface<Serializer<T, R>> = {};

	registerSerializer(name: string, serializer: Serializer<T, R>) {
		this.serializers[name] = serializer;
	}

	abstract pack(what: string, data: PackageInterface<T>): R[];
}

