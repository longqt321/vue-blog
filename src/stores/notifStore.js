import { defineStore } from "pinia";

export const useNotifStore = defineStore("notif", {
  state: () => ({
    notifs: [
      {
        id: 1,
        content: "Bạn có tin nhắn mới từ Long",
        time: "2 phút trước",
        read: false,
      },
      {
        id: 2,
        content: "Long đã thích bài viết của bạn",
        time: "1 giờ trước",
        read: false,
      },
      {
        id: 3,
        content: "Tham gia cuộc trò chuyện mới",
        time: "1 ngày trước",
        read: true,
      },
    ],
  }),
  actions: {
    addNotif(notif) {
      this.notifs.push(notif);
    },
    removeNotif(index) {
      this.notifs.splice(index, 1);
    },
    markAsRead(id) {
      const notif = this.notifs.find((n) => n.id === id);
      if (notif) {
        notif.read = true;
      }
    },
    markAllAsRead() {
      this.notifs.forEach((notif) => {
        notif.read = true;
      });
    },
  },
  getters: {
    getNotifs: (state) => state.notifs,
    getUnreadCount: (state) => {
      state.notifs.filter((notif) => !notif.read).length;
    },
    getNotificationTitle: (state) => {
      const unreadCount = state.notifs.filter((notif) => !notif.read).length;
      return unreadCount > 0
        ? `Bạn có ${unreadCount} thông báo chưa đọc`
        : `Không có thông báo mới`;
    },
  },
});
