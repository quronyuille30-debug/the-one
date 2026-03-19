type ConnectResponse = {
  success: boolean;
  message: string;
};

type StatusResponse = {
  success: boolean;
  status: string;
};

const api = {
  connectMT5: async (): Promise<ConnectResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'MT5 connection placeholder working',
        });
      }, 500);
    });
  },

  getStatus: async (): Promise<StatusResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          status: 'online',
        });
      }, 300);
    });
  },
};

export default api;
