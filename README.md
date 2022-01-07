# MyForumReact

Forum App build with NextJS

## Demo

[MyForum-React](https://my-forum-react.vercel.app/)

## Installation

- Set up API [MyForum-Server](https://github.com/akcer/MyForum-Server)

- Clone project

```bash
git clone https://github.com/akcer/MyForum-React.git
```

- Enter the project directory:

```bash
cd MyForumReact
```

- Create .env.local file

```bash
touch .env.local
```

- Add following environment variables:

```bash
NEXT_PUBLIC_API_HOST=http://localhost:3001/
NEXT_PUBLIC_API_GRAPHQL_HOST=http://localhost:3001/graphql/
```

- Install NPM dependencies:

```bash
npm install
```

- Run the development server:

```bash
npm run dev
```

- Go to <http://localhost:3000> to access the API.

## Technologies

- TypeScript
- NextJS
- GraphQL
- Bootstrap
