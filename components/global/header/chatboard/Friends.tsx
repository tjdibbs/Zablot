import React from "react";
import Chats from "./Chats";
import * as Interface from "@lib/interfaces";
/*
 * @param {{friends: Object[]}} props
 * @returns
 */

interface props {
  friends: Interface.Friend[];
  friendId: string;
}

function Friends(props: props) {
  const { friendId, friends } = props;
  const NotPrivateFriends = friends?.filter((friend) => !friend.IsPrivate);
  return (
    <div className="friends_chats chats_listbox" role="listbox">
      <ul className="chats-list list" role="list">
        {NotPrivateFriends?.map((user, index) => {
          return <Chats key={user.Id} friendId={friendId} friend={user} />;
        })}
        {!friends?.length && (
          <div className="no-friend-available">
            <div className="text">
              <span>You do not have any friend</span>
            </div>
          </div>
        )}
      </ul>
    </div>
  );
}

export default Friends;
