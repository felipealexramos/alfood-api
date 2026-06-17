import { Prato } from './prato.entity';

export interface PratoView {
  id: number;
  nome: string;
  descricao: string;
  tag: string;
  imagem: string | null;
  restaurante: number;
}

/**
 * Maps a Prato entity to the shape the front-end consumes (IPrato):
 * the stored image file name becomes an absolute URL and the relation is
 * flattened to the restaurante id.
 */
export function serializePrato(prato: Prato, appUrl: string): PratoView {
  return {
    id: prato.id,
    nome: prato.nome,
    descricao: prato.descricao,
    tag: prato.tag,
    imagem: prato.imagem
      ? `${appUrl.replace(/\/$/, '')}/media/${prato.imagem}`
      : null,
    restaurante: prato.restauranteId,
  };
}
