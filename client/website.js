const { createApp } = Vue;

createApp({
    data() {
        return {
            startVisa: true,
            visas: false,
            popupId: null,
            users: [],
            friendsList: [],
            closePopup: true,
            listVisa: false,
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
                const data = await fetch("http://localhost:8000/addToFriendsList", {
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
            const friendList = await fetch("http://localhost:8000/getFriendList");
            const friendsListJson = await friendList.json();
            this.friendsList = friendsListJson;
            console.log(friendsListJson);
        },
        async removeFriend(friendId) {
            const remove = await fetch("http://localhost:8000/removeFriend", {
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
        const data = await fetch("http://localhost:8000/allUsers");
        const jsonData = await data.json();
        this.users = jsonData.users
    }
}).mount("#main")