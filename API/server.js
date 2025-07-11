const allUsersRoute = new URLPattern({ pathname: "/allUsers" });
const addFriendsRoute = new URLPattern({ pathname: "/addToFriendsList" });
const getFriendsRoute = new URLPattern({ pathname: "/getFriendList" });
const removeFriendsRoute = new URLPattern({ pathname: "/removeFriend" });

async function readData() {
    const dataPath = "users.json";
    const data = await Deno.readTextFile(dataPath);
    return JSON.parse(data);
}

async function writeData(data) {
    const dataPath = "users.json";
    await Deno.writeTextFile(dataPath, JSON.stringify(data, null, 2));
}


async function handler(request) {

    const url = new URL(request.url);

    const allUsersMatch = allUsersRoute.exec(url);
    const addFriendsMatch = addFriendsRoute.exec(url);
    const getFriendsMatch = getFriendsRoute.exec(url);
    const removeFriendsMatch = removeFriendsRoute.exec(url);


    const headerCORS = new Headers();
    headerCORS.set("Access-Control-Allow-Origin", "*");
    headerCORS.set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    headerCORS.set("Access-Control-Allow-Headers", "Content-Type");

    if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: headerCORS });
    }

    async function userInfo() {
        const data = await fetch("https://dummyjson.com/users?limit=6&skip=0");
        const jsonData = await data.json();
        return jsonData;
    }

    if (allUsersMatch) {
        if (request.method == "GET") {
            return new Response(JSON.stringify(await userInfo()), { headers: headerCORS, status: 200 })
        }
    }

    if (addFriendsMatch) {
        if (request.method == "POST") {
            const data = await request.json();
            const allUsers = await userInfo();
            const correctUser = allUsers.users.find(dataId => dataId.id == data.userId);
            const fileData = await readData();
            if (correctUser) {
                fileData.push(correctUser)
                await writeData(fileData);
                return new Response("Success!", { headers: headerCORS, status: 200 })
            } else {
                return new Response("Unsucces!", { headers: headerCORS, status: 409 })
            }
        }
    }

    if (getFriendsMatch) {
        if (request.method == "GET") {
            const allUserData = await readData();
            return new Response(JSON.stringify(allUserData), { headers: headerCORS, status: 200 })
        }
    }

    if (removeFriendsMatch) {
        if (request.method == "DELETE") {
            const userID = await request.json();
            const allUserData = await readData();
            const friendUser = allUserData.find(user => user.id == userID.friendId);
            const newUsers = allUserData.filter(users => users.id != userID.friendId);
            if (friendUser) {
                writeData(newUsers);
                return new Response(JSON.stringify(friendUser), { headers: headerCORS, status: 202 });
            } else {
                return new Response("Something went wrong!", { headers: headerCORS, status: 409 });
            }
        }
    }
}




Deno.serve(handler);