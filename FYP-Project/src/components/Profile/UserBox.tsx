import React from 'react';

type UserBoxProps = {
  username: string | undefined;
  joined: string | undefined;
};

const UserBox: React.FC<UserBoxProps> = ({ username, joined }) => {
  return (
    <div className="text-center lg:text-left">
      <p className="text-3xl">{username}</p>
      <p className="text-xs text-gray-400">Joined {joined}</p>
    </div>
  );
};

export default UserBox;