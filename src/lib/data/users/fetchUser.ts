import { User } from 'discord.js';
import { getUser } from './getUser';
import { insertUser } from './insertUser';
import { updateUser } from './updateUser';

export async function fetchUser(user: User) {
  let userRow = await getUser(user.id);
  if (!userRow) {
    userRow = await insertUser({
      id: user.id,
      username: user.username,
      avatar_url: user.avatarURL(),
    });
  } else {
    if (
      userRow.username !== user.username ||
      userRow.avatar_url !== user.avatarURL()
    ) {
      userRow = await updateUser(user.id, {
        username: user.username,
        avatar_url: user.avatarURL(),
      });
    }
  }
  return userRow;
}
