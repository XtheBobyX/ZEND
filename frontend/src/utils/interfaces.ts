type UsuarioType = {
  id_usuario: string;
  username: string;
  email?: string;
  hash_password?: string;
  nombre_completo: string;
  avatar: string;
  portada?: string;
  biografia?: string;
};
type MultimediaType = {
  id_multimedia: string;
  id_post: string;
  id_usuario: string;
  tipo_archivo: string;
  url_archivo: string;
};
type Opciones_encuestaType = {
  id_opcion: string;
  id_encuesta: string;
  texto: string;
};
type EncuestaType = {
  id_encuesta: string;
  id_post: string;
  titulo: string;
  multiple_opciones: boolean;
  opciones_encuesta: Opciones_encuestaType[];
};

type PostType = {
  usuario?: UsuarioType;
  multimedia: MultimediaType[];
  reposts: [];
  likes: [];
  encuesta: EncuestaType;
  comentarios: [];
  id_post?: string;
  id_usuario: string;
  contenido: string;
  is_repost: number;
  id_post_original?: number;
  createdAt?: string;
};

export type {
  PostType,
  UsuarioType,
  EncuestaType,
  MultimediaType,
  Opciones_encuestaType,
};
