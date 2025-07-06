

const { createApp } = Vue;


createApp({
    data() {
        return {
            pathnames: [
                { allUsers: "allUsers" },
                { addFriends: "addToFriendsList" },
                { getAllFriends: "getFriendList" },
                { removeFriend: "removeFriend" }
            ],
            tests: {
                1: {},
                2: {},
                3: {},
                4: {},
            }
        }
    },
    methods: {

        async onlyGetPath(pathname, testNum) {
            try {
                const response = await fetch(`http://localhost:8000/${pathname}`)
                if (response.ok) {
                    this.tests[testNum] = { status: response.status, color: "green" };
                } else {
                    this.tests[testNum] = { status: response.status, color: "red" }
                }
            } catch (err) {
                this.tests[testNum] = { status: "ERROR", color: "red" }
            }
        },
        async otherMethodPath(pathname, method, body, testNum) {
            try {
                const response = await fetch(`http://localhost:8000/${pathname}`, {
                    method: method,
                    body: JSON.stringify(body),
                    headers: { "Content-Type": "application/json" }
                })
                if (response.ok) {
                    this.tests[testNum] = { status: response.status, color: "green" }
                } else {
                    this.tests[testNum] = { status: response.status, color: "red" }
                }
            } catch (err) {
                this.tests[testNum] = { status: "ERROR", color: "red" }
            }
        }
    }


}).mount("#test")

