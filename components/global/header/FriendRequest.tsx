/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-key */
/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CSSTransition } from "react-transition-group";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { IconButton, Badge, Button, Avatar } from "@mui/material";
import j from "jquery";
import * as Interfaces from "../../../lib/interfaces";
import { emitCustomEvent } from "react-custom-events";
import { useAppSelector } from "@lib/redux/store";
import { formatDistanceToNowStrict } from "date-fns";
import Image from "next/image";
import stringToColor from "@utils/stringToColor";

const FriendRequests = () => {
  const { socket, user } = useAppSelector((state) => state.sessionStore);
  const [requests, setRequests] = useState<Partial<Interfaces.Requests[]>>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const IconButtonRef = useRef<HTMLButtonElement>(null);
  const Backdrop = useRef<HTMLDivElement>(null);
  const [friends, setFriends] = React.useState([]);

  const Reject = (id: string) => {
    let data = {
      going_id: id,
      coming_id: user._id,
      coming_name: user?.FullName,
      coming_image: user?.Image.profile,
    };
    socket.emit("REJECT_REQUEST", data, (err: string, done: string) => {
      setRequests((state) => {
        return (state = state.map((req) => {
          if (req.From === id) {
            return { ...req, Rejected: true };
          }
          return req;
        }));
      });

      setTimeout(() => {
        setRequests((state) => {
          return (state = state.filter((req) => req.From !== id));
        });
      }, 5000);
    });
  };

  const Accept = (data: Interfaces.Requests) => {
    const data_to_emit = {
      going_id: data.From,
      going_name: data.Name,
      going_image: data.Image,
      coming_id: user._id,
      coming_name: user?.FullName,
      coming_image: user?.Image.profile,
    };

    socket.emit(
      "ACCEPT_REQUEST",
      data_to_emit,
      (err: string | object, FriendData: Interfaces.Friend) => {
        if (!err) {
          setRequests((state) => {
            return state.map((req) => {
              if (req.From === data.From) {
                return { ...req, Accepted: true };
              }
              return req;
            });
          });

          let newFriend = {
            ...FriendData,
            Id: data.From,
            Name: data.Name,
            Image: data.Image,
            isComing: false,
          };

          setFriends([newFriend, ...friends]);
          emitCustomEvent("newFriend", newFriend);
        } else {
          let reload = confirm(
            "There is an error processing new friend request. Would you like to reload the page?."
          );
          if (reload) location.reload();
        }
      }
    );
  };

  const Message = (id: string) => {
    setOpenModal(false);
    emitCustomEvent("openRoomById", id);
  };

  const FRIENDSHIP_DEMAND = (data: Interfaces.Requests) => {
    const newRequest: Interfaces.Requests = {
      From: data.From,
      Name: data.Name,
      UserName: data.UserName,
      Image: data.Image,
      Date: new Date(),
    };

    // Incase the friend_request coming in has been process b4, let's send response immediately
    // let isFriend =
    //   friends.findIndex((friend) => friend.Id === data.From) !== -1;
    // if (isFriend) {
    //   Accept(newRequest);
    //   return;
    // }
    // Check if new request is already existing and add new or removing any existing one
    setRequests([newRequest, ...requests.filter((r) => r.From !== data.From)]);
  };

  const REMOVE_REQUEST = (data: { from: string }) => {
    setRequests((state) => {
      return (state = state.filter((user) => user.From !== data.from));
    });
  };

  useEffect(() => {
    if (socket) {
      socket.on("FRIENDSHIP_DEMAND", FRIENDSHIP_DEMAND);
      socket.on("REMOVE_REQUEST", REMOVE_REQUEST);
    }

    return () => {
      socket?.off("REMOVE_REQUEST", REMOVE_REQUEST);
      socket?.off("FRIENDSHIP_DEMAND", FRIENDSHIP_DEMAND);
    };
  }, [socket]);

  useEffect(() => {
    if (user) {
      setRequests([...user.FriendRequests].reverse());
      setFriends(user.Friends);
    }
  }, [user]);

  const CloseModal = () => {
    setOpenModal(false);
    IconButtonRef.current.classList.remove("active");
    setRequests(requests.filter((r) => !r.Accepted));
  };

  const handleOpen = () => {
    IconButtonRef.current.classList.toggle("active");
    setOpenModal(true);
  };

  const CaptureClick = (e: React.MouseEvent) => {
    e.target === Backdrop.current && CloseModal();
  };
  return (
    <div className="friendrequest-wrapper">
      <Badge color="secondary" badgeContent={requests.length} showZero>
        <IconButton className="open" ref={IconButtonRef} onClick={handleOpen}>
          <PersonAddIcon fontSize="small" />
        </IconButton>
      </Badge>
      <AnimatePresence exitBeforeEnter={true} initial={false}>
        {openModal && (
          <motion.div
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="requests-backdrop"
            ref={Backdrop}
            onClickCapture={CaptureClick}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.7, visibility: "hidden" }}
              className="requests-box"
            >
              <div className="requests-header">
                <div className="title">Friend Requests</div>
                <motion.button
                  className="close-modal modal"
                  onClick={CloseModal}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: "rgb(53,163,180)",
                    color: "rgb(255,255,255)",
                  }}
                >
                  <span>Close</span>
                </motion.button>
              </div>
              <div className="requests-list">
                <ul className="users">
                  {requests?.map((friend, index) => {
                    var duration = formatDistanceToNowStrict(
                      new Date(friend.Date)
                    );

                    return (
                      <Requests
                        key={index}
                        accept={Accept}
                        reject={Reject}
                        message={Message}
                        friend={friend}
                        duration={duration}
                      />
                    );
                  })}
                  {!Boolean(requests?.length) && (
                    <div className="no_request !text-sm">
                      <h6>There is no request available</h6>
                    </div>
                  )}
                </ul>
              </div>
              <PeopleYouMightKnow />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface RequestsInterface {
  friend: Interfaces.Requests;
  accept(user: Interfaces.Requests): void;
  reject(id: string): void;
  duration: string;
  message(id: string): void;
}
function Requests(props: RequestsInterface) {
  const { friend, duration, accept, reject, message } = props;

  return (
    <li className="user">
      <div className="user-profile">
        <Avatar
          src={friend.Image}
          sx={{
            bgcolor: stringToColor(friend.Name),
          }}
        >
          {friend.Name.split(" ")[0][0] +
            (friend.Name.split(" ")[1]?.at(0) ?? "")}
        </Avatar>
        <div className="user-name">
          <div className="name">
            <span>{friend.Name}</span>
          </div>
          <div className="username !text-xs">
            <span>@{friend.UserName}</span>
          </div>
          <small className="block mt-1 text-xs" style={{ fontSize: 10 }}>
            {" "}
            {duration} ago
          </small>
        </div>
      </div>
      {friend?.Accepted && (
        <Button
          size="small"
          className="btn open-chat"
          onClick={() => message(friend.From)}
        >
          Message
        </Button>
      )}
      {friend?.Rejected && (
        <Button size="small" className="btn rejected" disabled={true}>
          Rejected
        </Button>
      )}
      {!friend?.Accepted && !friend?.Rejected && (
        <div className="friend-reject-accept-btn btn-wrapper">
          <Button
            size="small"
            onClick={(e) => {
              accept(friend);
            }}
            className="accept btn !bg-green text-white"
          >
            <span className="accept-text ">Accept</span>
          </Button>
          <Button
            size="small"
            onClick={(e) => {
              reject(friend.From);
            }}
            className="reject btn button !bg-gradient-to-r from-red-200"
          >
            <span className="reject-text">Reject</span>
          </Button>
        </div>
      )}
    </li>
  );
}

function PeopleYouMightKnow() {
  return (
    <div className="related-friends friends">
      <div className="title">You might know this people</div>
      <ul className="users">
        <li className="user">
          <div className="user-profile">
            <div className="user-image">
              <div className="image-wrapper">
                <img
                  src="./images/4e92ca89-66af-4600-baf8-970068bcff16.jpg"
                  alt="user-image"
                  className="image"
                />
              </div>
            </div>
            <div className="user-name">
              <div className="name">
                <span>Timi James</span>
              </div>
              <div className="username">
                <span>@tjdbbs</span>
              </div>
            </div>
          </div>
          <div className="friend-reject-accept-btn btn-wrapper">
            <Button size="small" className="accept btn !bg-green text-white">
              <span className="accept-text ">Add</span>
            </Button>
            <Button
              size="small"
              className="reject btn button !bg-gradient-to-r from-red-200"
            >
              <span className="reject-text">Cancel</span>
            </Button>
          </div>
        </li>
      </ul>
    </div>
  );
}

export default React.memo(FriendRequests);
