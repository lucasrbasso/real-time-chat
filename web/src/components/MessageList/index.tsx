import { api } from '../../services/api';

import styles from './styles.module.scss';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

interface MessageProps {
  id: string;
  text: string;
  user: {
    name: string;
    avatar_url: string;
  };
}

const messagesQueue: MessageProps[] = [];

const socket = io('http://localhost:4000');

socket.on('new_message', (newMessage: MessageProps) => {
  messagesQueue.push(newMessage);
  console.log(newMessage);
});

export const MessageList = () => {
  const [messages, setMessages] = useState<MessageProps[]>([]);

  useEffect(() => {
    setInterval(() => {
      if (messagesQueue.length > 0) {
        setMessages((prevState) =>
          [messagesQueue[0], prevState[0], prevState[1]].filter(Boolean)
        );
      }
      messagesQueue.shift();
    }, 1000);
  }, []);

  useEffect(() => {
    api.get<MessageProps[]>('/messages/last3').then((response) => {
      setMessages(response.data);
    });
  }, []);

  return (
    <div className={styles.messageListWrapper}>
      <ul className={styles.messageList}>
        {messages.map((message) => (
          <li className={styles.message} key={message.id}>
            <div className={styles.messageUser}>
              <div className={styles.userImage}>
                <img src={message.user.avatar_url} alt={message.user.name} />
              </div>
              <span>{message.user.name}</span>
            </div>
            <p className={styles.messageContent}>- {message.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
