type UserType = {
  user_id: string;
  username: string;
  email?: string;
  password_hash?: string;
  full_name: string;
  avatar: string;
  cover?: string;
  biography?: string;
};

type MultimediaType = {
  multimedia_id: string;
  post_id: string;
  user_id: string;
  file_type: string;
  file_url: string;
};

type PollOptionType = {
  option_id: string;
  poll_id: string;
  content: string;
};

type PollType = {
  poll_id: string;
  post_id: string;
  title: string;
  multiple_choices: boolean;
  poll_options: PollOptionType[];
};

type PostType = {
  user?: UserType;
  multimedia: MultimediaType[];
  reposts: [];
  likes: [];
  poll: PollType;
  comments: [];
  post_id?: string;
  user_id: string;
  content: string;
  is_repost: number;
  original_post_id?: number;
  created_at?: string;
};

type ButtonProps = {
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
};

export type {
  PostType,
  UserType,
  PollType,
  MultimediaType,
  PollOptionType,
  ButtonProps,
};
