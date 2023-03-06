import { message } from "antd";

export const showSuccess = (messageData, time = 10) => {
  message.destroy();
  message.success({
    content: messageData,
    time,
  });
};

export const showError = (messageData, time = 10) => {
  message.destroy();
  message.error({
    content: messageData,
    time,
  });
};
