// client/data/dummyData.ts

  export const exampleWorkspace = {
    id: 1,
    name: 'TeamFlow 프로젝트',
    created_at: '2024-03-20T00:00:00Z',
    users_id: 1,
  };

  export  const exampleMembers = [
    {
      id: 1,
      users_id: 1,
      workspaces_id: 1,
      role: 'host',
      user: {
        id: 1,
        email: 'host@example.com',
        name: '호스트',
        phone: '01012345678',
        profile_image: 'https://github.com/shadcn.png',
        created_at: '2024-03-20T00:00:00Z',
        updated_at: '2024-03-20T00:00:00Z',
      },
    },
    {
      id: 2,
      users_id: 2,
      workspaces_id: 1,
      role: 'guest',
      user: {
        id: 2,
        email: 'guest1@example.com',
        name: '게스트 1',
        phone: '01087654321',
        profile_image: null,
        created_at: '2024-03-20T00:00:00Z',
        updated_at: '2024-03-20T00:00:00Z',
      },
    },
    {
      id: 3,
      users_id: 3,
      workspaces_id: 1,
      role: 'guest',
      user: {
        id: 3,
        email: 'guest2@example.com',
        name: '게스트 2',
        phone: '01011112222',

        profile_image: null,
        created_at: '2024-03-20T00:00:00Z',
        updated_at: '2024-03-20T00:00:00Z',
      },
    },
    {
      id: 4,
      users_id: 4,
      workspaces_id: 1,
      role: 'guest',
      user: {
        id: 4,
        email: 'guest2@example.com',
        name: '게스트 3',
        phone: '01033333333',

        profile_image: null,
        created_at: '2024-03-20T00:00:00Z',
        updated_at: '2024-03-20T00:00:00Z',
      },
    },
    {
      id: 5,
      users_id: 5,
      workspaces_id: 1,
      role: 'guest',
      user: {
        id: 5,
        email: 'guest2@example.com',
        name: '게스트 4',
        phone: '01044444444',

        profile_image: null,
        created_at: '2024-03-20T00:00:00Z',
        updated_at: '2024-03-20T00:00:00Z',
      },
    },
    {
      id: 6,
      users_id: 6,
      workspaces_id: 1,
      role: 'guest',
      user: {
        id: 6,
        email: 'guest2@example.com',
        name: '게스트 5',
        phone: '01055555555',

        profile_image: null,
        created_at: '2024-03-20T00:00:00Z',
        updated_at: '2024-03-20T00:00:00Z',
      },
    },
    {
      id: 7,
      users_id: 7,
      workspaces_id: 1,
      role: 'guest',
      user: {
        id: 7,
        email: 'guest2@example.com',
        name: '게스트 6',
        phone: '01011116666',

        profile_image: null,
        created_at: '2024-03-20T00:00:00Z',
        updated_at: '2024-03-20T00:00:00Z',
      },
    },
    {
      id: 8,
      users_id: 8,
      workspaces_id: 1,
      role: 'guest',
      user: {
        id: 8,
        email: 'guest2@example.com',
        name: '게스트 7',
        phone: '01011117777',

        profile_image: null,
        created_at: '2024-03-20T00:00:00Z',
        updated_at: '2024-03-20T00:00:00Z',
      },
    },
    {
      id: 9,
      users_id: 9,
      workspaces_id: 1,
      role: 'guest',
      user: {
        id: 9,
        email: 'guest2@example.com',
        name: '게스트 8',
        phone: '01011118888',

        profile_image: null,
        created_at: '2024-03-20T00:00:00Z',
        updated_at: '2024-03-20T00:00:00Z',
      },
    },
    {
      id: 10,
      users_id: 10,
      workspaces_id: 1,
      role: 'guest',
      user: {
        id: 10,
        email: 'guest2@example.com',
        name: '게스트 9',
        phone: '01011119999',

        profile_image: null,
        created_at: '2024-03-20T00:00:00Z',
        updated_at: '2024-03-20T00:00:00Z',
      },
    },
  ];