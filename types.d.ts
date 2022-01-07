interface Section {
  id?: number;
  section?: string;
  categories?: Category[];
  createdAt?: Date;
}

interface Category {
  id?: number;
  categoryTitle?: string;
  categoryDescription?: string;
  threads: Thread[];
  sectionId?: number;
  createdAt?: Date;
}

interface Post {
  id?: number;
  post?: string;
  author?: User;
  createdAt: Date;
  likingUsers: [User];
}

interface Thread {
  id?: number;
  threadTitle: string;
  threadDescription: string;
  posts?: [Post];
  postsCount?: number;
  category: Category;
  author?: User;
  createdAt?: Date;
  latestPost?: Post;
}

interface User {
  id?: number;
  username?: string;
  email?: string;
  password?: string;
  avatar?: string;
  isAdmin?: boolean;
  createdAt?: Date;
  //setUserFromLocalStorage?: () => void;
}

interface SetUserFromLocalStorage {
  setUserFromLocalStorage: () => void;
}
