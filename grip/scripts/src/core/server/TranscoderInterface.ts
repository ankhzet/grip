
export interface TranscoderInterface<M, D> {
	encode(model: M): D;
	decode(data: D, use?: M): M;
}
