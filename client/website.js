const { createApp } = Vue;

createApp({
    data() {
        return {
            startVisa: true,
            mainShow: false,
            popupId: null,
            users: [],
            friendsList: [],
            closePopup: true,
            friendsListShow: false,
            hover: null,
        }
    },
    methods: {
        showPopup(userId) {
            this.popupId = userId;
        },
        showHover(userId) {
            this.hover = userId;
        },
        async addFriendToList(userId) {
            try {
                const data = await fetch("https://philles85-testsite-fo-13.deno.dev/addToFriendsList", {
                    method: "POST",
                    body: JSON.stringify({ userId }),
                    headers: { "Content-Type": "application/json" }
                });
                if (data.ok) {
                    this.users = this.users.filter(user => user.id != userId);
                }
            } catch (error) {

            }

        },
        async friendList() {
            const friendList = await fetch("https://philles85-testsite-fo-13.deno.dev/getFriendList");
            const friendsListJson = await friendList.json();
            this.friendsList = friendsListJson;
            console.log(friendsListJson);
        },
        async removeFriend(friendId) {
            const remove = await fetch("https://philles85-testsite-fo-13.deno.dev/removeFriend", {
                method: "DELETE",
                body: JSON.stringify({ friendId }),
                headers: { "Content-Type": "application/json" }
            })
            if (remove.ok) {
                await this.friendList();
                this.users.push(await remove.json())
            }
        }

    },

    async mounted() {
        const data = await fetch("https://philles85-testsite-fo-13.deno.dev/allUsers");
        const jsonData = await data.json();
        this.users = jsonData.users
    }
}).mount("#main")