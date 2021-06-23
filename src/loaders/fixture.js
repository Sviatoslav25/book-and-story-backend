import UserService from '../services/UserService';

const defaultUsers = [
  {
    _id: '1',
    email: 'bbb@ggg.com',
    password: '12345',
  },
  {
    _id: '2',
    email: 'aaa@ggg.com',
    password: '12345',
  },
];

export default function fixtures() {
  defaultUsers.forEach((u) => {
    UserService.createAccount(u);
  });
}
